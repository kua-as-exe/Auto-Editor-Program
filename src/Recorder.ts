import { PathResolve, PathParse, getOrCreateDir, removeDir } from './Utilities';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { IRecordHTMLFileConfig } from './interfaces';
//import * as timesnap from 'timesnap';
const timesnap = require('timesnap');

export const RecordHTMLFile = (options: any): Promise<any> => {
    return new Promise( (resolve, reject) => {
        console.log(options);
    })
}


export function record(config: IRecordHTMLFileConfig){
    config = Object.assign({
        roundToEvenWidth: true,
        roundToEvenHeight: true,
      }, config || {});
      console.log(config)
      var output = PathResolve(process.cwd(), config.output || 'video.mp4');
    
      var frameDirectory: string;
      var outputPattern: string;
      var convertProcess: ChildProcessWithoutNullStreams;
    
      frameDirectory = 'timecut-' + (config.keepFrames ? 'frames-' : 'temp-') + (new Date()).getTime();
      
      frameDirectory = PathResolve(PathParse(output).dir);
      outputPattern = PathResolve(frameDirectory, 'image-%09d.png');
    
      var timesnapConfig = Object.assign({}, config, {
        output: '',
        outputPattern: outputPattern
      });
    
      const log = (...args: any[]) => {
        if(!config.quiet) console.log.apply(null, [args])
      }   
    
      var makeProcessPromise = function () {
        //makeFileDirectoryIfNeeded(output);
        getOrCreateDir(output);
        var input = outputPattern;
    
        let ffmpegArguments = [
          '-framerate', String(config.fps),
          '-i', input.replace(/\\/g, "/"),
          '-vcodec', 'ffvhuff',
          '-y', output.replace(/\\/g, "/")
        ]
        
        convertProcess = spawn('ffmpeg.exe', ffmpegArguments);
        convertProcess.stderr.setEncoding('utf8');
        convertProcess.stderr.on('data', (data) => log(data) );
        return new Promise(function (resolve, reject) {
          convertProcess.on('close', () => resolve() );
    
          convertProcess.on('error', (err) => reject(err) );
    
          convertProcess.stdin.on('error', (err) => reject(err) );
        })
      };
    
      return timesnap(timesnapConfig)
        .then(() => { if (convertProcess) convertProcess.stdin.end() })
            .then( makeProcessPromise())
                .catch((err: any) => log(err))
                .then(() => { 
                    if (!config.keepFrames) removeDir(frameDirectory) 
                });
}