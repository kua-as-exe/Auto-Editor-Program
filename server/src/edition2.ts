import { ElementProcessor } from './../../src/ElementProcessor';
import { IVideoElement } from "./../../src/Interfaces";
import { spawnSync } from 'child_process';
import { PathJoin, exists, getOrCreateDir, removeDir } from '../../src/Utilities';
import { renameSync } from 'fs-extra';

export const startEdition = async (path: string, videoName:string) => {
    const video = new ElementProcessor(1, {
        resolution: { width: 1280, height: 720 },
        preserveProccess: false,
        log: false
    });
    video.add({
        templateConfig: {
            name: 'anotation1',
            params: {
                'text': 'Jorge Arreola',
                'subtext': 'CodeBros',
                'duration': 8,
                //'fps': 25,
                'startTime': 8,
                'videoPosition': {
                    'x': 30,
                    'y': 30
                },
            }
        }
    });
    video.add({
        templateConfig: {
            name: 'image1',
            params: {
                'duration': 5,
                //'fps': 25,
                'startTime': 3,
                'timeOffset': 1,
                'videoPosition': {
                    'x': 0,
                    'y': 0
                },
            }
        }
    });
    

    const res = await video.processElements();
    //console.log(res);
    let videoOriginPath = PathJoin(path, videoName);
    if (!exists(videoOriginPath)) {
        console.log("Video file path wrong or not existst");
        return 0;
    }

    let mainVideoDir = videoOriginPath;
    const outVideoDir = PathJoin(path, 'output');
    getOrCreateDir(outVideoDir);
    
    const outVideoPath = PathJoin(outVideoDir, videoName);
    const videoElements: string[] = []
    const filters: string[] = [];
    //const duration = 15;
    console.log("VAMONOS ALV")
    const addVideoElement = (element: IVideoElement, _inputChannel1?: string, _inputChannel2?: string, _outputChannel?: string)  => {
        //console.log("videoElement", videoElements, "\n channel: ", _outputChannel, "\n")
        if(element && element.videoOutput.output) {
            let startTime = element.templateConfig.params.startTime || 0;
            startTime -= element.templateConfig.params.timeOffset || 0;

            let xPosition = element.templateConfig.params.videoPosition && element.templateConfig.params.videoPosition.x || 0;
            let yPosition = element.templateConfig.params.videoPosition && element.templateConfig.params.videoPosition.y || 0;
            
            var offsets = element.templateConfig.params.positionOffset;
            if(offsets) xPosition -= offsets.x || 0;
            if(offsets) yPosition -= offsets.y || 0;

            let inputChannel1 = _inputChannel1 || 0;
            let inputChannel2 = _inputChannel2 || 1;
            let outputChannel = _outputChannel? `[${_outputChannel}]`: '';
            videoElements.push(`-itsoffset ${startTime} -i ${element.videoOutput.output}`);
            filters.push(`[${inputChannel1}][${inputChannel2}] overlay=${xPosition}:${yPosition}${outputChannel}`);
        }
    }    

    const addVideoElements = (elements: IVideoElement[]) => {
        let lastOutput: string
        elements.forEach( (element, i, array) => {
            let inChannel1 = lastOutput || '0';
            let inChannel2 = String(i+1);
            let outChannel = (i == elements.length-1? '': 'out'+(elements.length-1-i));
            addVideoElement(element, inChannel1, inChannel2, outChannel);
            lastOutput = outChannel;
        })
    }

    addVideoElements(res);

    let scale = "\"scale=" + video.resolution.width + ":" + video.resolution.height + "\"";
    let resizedVideoOutput = PathJoin(path, "_" + videoName + ".mp4");
    let videoResizeParams = [
        ['./src/ffmpeg.exe'],
        ['-i', mainVideoDir],
        ['-vf', scale],
        ['-y', resizedVideoOutput]
    ].map(e => e.join(" ")).join(" ");

    console.log(videoResizeParams);

    var t = await spawnSync("powershell.exe", [videoResizeParams]);
    console.log(t.stdout.toString())
    console.log(t.stderr.toString())

    removeDir(mainVideoDir);
    mainVideoDir = mainVideoDir + ".mp4";
    console.log(mainVideoDir);
    renameSync(resizedVideoOutput, mainVideoDir);

    let videoParams = [
        ['./src/ffmpeg.exe'],
       // ['-t', duration],
        ['-i', mainVideoDir],
        videoElements,
        ['-filter_complex', '"', filters.join("; "), '"'],
        ['-y'],
        [ outVideoPath+".mp4" ]
    ]

    let ffmpegCommand = videoParams.map(e => e.join(" ")).join(" ");
    
    console.log(ffmpegCommand);
    var t = await spawnSync("powershell.exe", [ffmpegCommand]);
    console.log(t.stdout.toString())
    console.log(t.stderr.toString())
   
}