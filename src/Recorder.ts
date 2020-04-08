import { PathResolve, PathParse, getOrCreateDir, removeDir, PathJoin } from './Utilities';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { IRecordHTMLFileConfig } from './interfaces';
import chalk from 'chalk';
//import * as timesnap from 'timesnap';
const timesnap = require('timesnap');

export const RecordHTMLFile = (options: IRecordHTMLFileConfig): Promise<any> => {
    return record(options);
}


export function record(config: IRecordHTMLFileConfig): Promise<any>{
    config = Object.assign({
        roundToEvenWidth: true,
        roundToEvenHeight: true,
      }, config || {});
      var output = PathResolve(process.cwd(), config.output || 'video.mp4');
      //var output = config.output
    
      var frameDirectory: string;
      var outputPattern: string;
      var convertProcess: ChildProcessWithoutNullStreams;
    
      frameDirectory = 'timecut-' + (config.keepFrames ? 'frames-' : 'temp-') + (new Date()).getTime();
      
      frameDirectory = PathJoin(PathParse(output).dir, frameDirectory);
      outputPattern = PathJoin(frameDirectory, 'image-%09d.png');
    
      var timesnapConfig = Object.assign({}, config, {
        output: '',
        outputPattern: outputPattern
      });
    
      const log = (...args: any[]) => {
        if(!config.quiet) console.log.apply(null, [args])
      }   
    

      
      var makeProcessPromise = function () {
        var input = outputPattern;
    
        let ffmpegArguments = [
          '-framerate', String(config.fps),
          '-i', input,
          '-vcodec', 'ffvhuff',
          '-y', output
        ]
        
        convertProcess = spawn('./src/ffmpeg.exe', ffmpegArguments);
        convertProcess.stderr.setEncoding('utf8');
        convertProcess.stderr.on('data', log );
        convertProcess.stderr.on('error', (err) => log(chalk.red(err)) );
        convertProcess.on('error', (err) => log(chalk.red(err)) );
        return new Promise(function (resolve, reject) {
          convertProcess.on('close', () => resolve() );
    
          convertProcess.on('error', (err) => reject(err) );
    
          convertProcess.stdin.on('error', (err) => reject(err) );
        })
      };
    
      
    return new Promise( (resolve, reject) => {
        const res = timesnap(timesnapConfig)
        .then(() => { 
            makeProcessPromise()
            .then(() => { 
                if (!config.keepFrames) removeDir(frameDirectory) 
                convertProcess.stdin.end()
                resolve("True")
            })
            .catch((err: any) => log(err))
        })
    });
}