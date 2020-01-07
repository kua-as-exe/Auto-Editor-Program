import { processElement } from "./src/VideoElement";
import { exec } from 'child_process';
import { VideoElement } from "./src/Interfaces";

const main = async () => {

    let res1:VideoElement = await processElement({
        templateConfig: {
            name: 'title1', 
            params: {
                'title': 'Chocolate',
                'subtitle': 'Malteada',
                'duration': 5,
                'fps': 15,
                'timeOfset': 2,
                'positionOfset':{
                    'x': 50,
                    'y': 50
                }
            }
        }
    })
    let res2:VideoElement = await processElement({
        templateConfig: {
            name: 'title1', 
            params: {
                'title': 'Snack',
                'subtitle': 'Hot dog',
                'duration': 5,
                'fps': 15,
                'timeOfset': 10,
                'positionOfset':{
                    'x': 200,
                    'y': 200
                }
            }
        }
    })
    console.log(res1);
    console.log(res2);
    
    const mainVideoDir = 'recorder/mainVideo2.mp4';
    const outVideoDir = 'finalVideo.mp4';
    const videoElements: string[] = []
    const filters: string[] = [];
    const duration = 20;

    const addVideoElement = (element: VideoElement, _inputChannel1?: string, _inputChannel2?: string, _outputChannel?: string)  => {
        //console.log("videoElement", videoElements, "\n channel: ", _outputChannel, "\n")
        if(element && element.videoOutput.output) {
            let timeOfset = element.templateConfig.params.timeOfset || 0;
            let xOfset = element.templateConfig.params.positionOfset.x || 0;
            let yOfset = element.templateConfig.params.positionOfset.y || 0;
            let inputChannel1 = _inputChannel1 || 0;
            let inputChannel2 = _inputChannel2 || 1;
            let outputChannel = _outputChannel? `[${_outputChannel}]`: '';
            videoElements.push(`-itsoffset ${timeOfset} -i ${element.videoOutput.output}`);
            filters.push(`[${inputChannel1}][${inputChannel2}]overlay=${xOfset}:${yOfset}${outputChannel}`);
        }
    }    

    const addVideoElements = (elements: VideoElement[]) => {
        let lastOutput: string
        elements.forEach( (element, i, array) => {
            let inChannel1 = lastOutput || '0';
            let inChannel2 = String(i+1);
            let outChannel = (i == elements.length-1? '': 'out'+(elements.length-1-i));
            addVideoElement(element, inChannel1, inChannel2, outChannel);
            lastOutput = outChannel;
        })
    }

    addVideoElements([res1,res2])

    let videoParams = [
        ['ffmpeg'],
        ['-t', duration],
        ['-i', mainVideoDir],
        videoElements,
        ['-filter_complex', '"', filters.join("; "), '"'],
        ['-y'],
        [ outVideoDir ]
    ]

    let ffmpegCommand = videoParams.map(e => e.join(" ")).join(" ");
    
    exec(ffmpegCommand, (err, stdout) => {
        if(err) console.error(err);
        console.log(stdout);
    })
    
}

main();