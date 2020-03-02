"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const VideoElement_1 = require("./src/VideoElement");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let res1 = yield VideoElement_1.processElement({
        templateConfig: {
            name: 'simpleText',
            params: {
                'title': 'Chocolate',
                'subtitle': 'Malteada',
                'duration': 1,
                'fps': 15,
                'startTime': 2,
                'timeOffset': 1,
                'videoPosition': {
                    'x': 0,
                    'y': 0
                },
            }
        }
    });
    let res2 = yield VideoElement_1.processElement({
        templateConfig: {
            name: 'anotation1',
            params: {
                'text': 'A & S',
                'subtext': 'Fine guitars',
                'duration': 1,
                'startTime': 2,
            }
        }
    });
    console.log(res1);
    console.log(res2);
    const mainVideoDir = 'recorder/mainVideo.mp4';
    const outVideoDir = 'finalVideo.mp4';
    const videoElements = [];
    const filters = [];
    const duration = 15;
    const addVideoElement = (element, _inputChannel1, _inputChannel2, _outputChannel) => {
        //console.log("videoElement", videoElements, "\n channel: ", _outputChannel, "\n")
        if (element && element.videoOutput.output) {
            let startTime = element.templateConfig.params.startTime || 0;
            startTime -= element.templateConfig.params.timeOffset || 0;
            let xPosition = element.templateConfig.params.videoPosition.x || 0;
            let yPosition = element.templateConfig.params.videoPosition.y || 0;
            var offsets = element.templateConfig.params.positionOffset;
            if (offsets)
                xPosition -= offsets.x || 0;
            if (offsets)
                yPosition -= offsets.y || 0;
            let inputChannel1 = _inputChannel1 || 0;
            let inputChannel2 = _inputChannel2 || 1;
            let outputChannel = _outputChannel ? `[${_outputChannel}]` : '';
            videoElements.push(`-itsoffset ${startTime} -i ${element.videoOutput.output}`);
            filters.push(`[${inputChannel1}][${inputChannel2}]overlay=${xPosition}:${yPosition}${outputChannel}`);
        }
    };
    const addVideoElements = (elements) => {
        let lastOutput;
        elements.forEach((element, i, array) => {
            let inChannel1 = lastOutput || '0';
            let inChannel2 = String(i + 1);
            let outChannel = (i == elements.length - 1 ? '' : 'out' + (elements.length - 1 - i));
            addVideoElement(element, inChannel1, inChannel2, outChannel);
            lastOutput = outChannel;
        });
    };
    addVideoElements([res1, res2]);
    let videoParams = [
        ['ffmpeg'],
        ['-t', duration],
        ['-i', mainVideoDir],
        videoElements,
        ['-filter_complex', '"', filters.join("; "), '"'],
        ['-y'],
        [outVideoDir]
    ];
    let ffmpegCommand = videoParams.map(e => e.join(" ")).join(" ");
    /*exec(ffmpegCommand, (err, stdout) => {
        if(err) console.error(err);
        console.log(stdout);
    })*/
});
main();
