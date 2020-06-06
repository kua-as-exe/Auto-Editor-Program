import { ElementProcessor } from '../../src/ElementProcessor';
import { IVideoElement } from "../../src/Interfaces";
import { spawnSync } from 'child_process';
import { PathJoin, exists, getOrCreateDir, removeDir, PathParse } from '../../src/Utilities';
import { renameSync, readdirSync } from 'fs-extra';

const processorPath = './processors/processor_1';

const main = async () => {
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
    
    const elements = await video.processElements();
    const outVideoDir = PathJoin(processorPath, 'output');
    getOrCreateDir(outVideoDir);
    
    let videos = await readdirSync(PathJoin(processorPath, 'videos'))
    videos.forEach( async (video: string) =>{
        console.log("Editing video: ", video);
        await editVideo(video, elements)
    })
}

const editVideo = async (inVideoPath: string, elements: IVideoElement[]) => {
    let originalFile = inVideoPath;
    let videoOriginPath = PathJoin(processorPath,'videos',inVideoPath);
    
    let videoPathElements = PathParse(originalFile);
    let videoName = videoPathElements.name+".mp4"
    let outVideoDir = PathJoin(processorPath, 'output');

    let mainVideoDir = videoOriginPath;    
    const outVideoPath = PathJoin(outVideoDir, videoName);
    const videoElements: string[] = []
    const filters: string[] = [];
    
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

    addVideoElements(elements);

    let ffmpegCommand = [
        ['./src/ffmpeg.exe'],
        ['-i', '\"'+mainVideoDir+'\"'],
        videoElements,
        ['-filter_complex', '"', filters.join("; "), '"'],
        ['-y'],
        [ outVideoPath ]
    ].map(e => e.join(" ")).join(" ");
    
    console.log(ffmpegCommand);
    var t = await spawnSync("powershell.exe", [ffmpegCommand]);
    console.log(t.status)
    console.log(t.stdout.toString())
    console.log(t.stderr.toString())
}

main();
