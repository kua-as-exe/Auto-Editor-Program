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
const ElementProcessor_1 = require("./../../src/ElementProcessor");
const child_process_1 = require("child_process");
const Utilities_1 = require("../../src/Utilities");
const fs_extra_1 = require("fs-extra");
exports.startEdition = (path, videoName) => __awaiter(void 0, void 0, void 0, function* () {
    const video = new ElementProcessor_1.ElementProcessor(1, {
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
                'duration': 5,
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
                'startTime': 1,
                'timeOffset': 1,
                'videoPosition': {
                    'x': 0,
                    'y': 0
                },
            }
        }
    });
    const res = yield video.processElements();
    //console.log(res);
    let videoPath = Utilities_1.PathJoin(path, videoName);
    if (!Utilities_1.exists(videoPath)) {
        console.log("Video file path wrong or not existst");
        return 0;
    }
    let mainVideoDir = videoPath;
    Utilities_1.getOrCreateDir(videoOutputPath);
    const outVideoDir = Utilities_1.PathJoin(videoOutputPath, videoName);
    const videoElements = [];
    const filters = [];
    //const duration = 15;
    const addVideoElement = (element, _inputChannel1, _inputChannel2, _outputChannel) => {
        //console.log("videoElement", videoElements, "\n channel: ", _outputChannel, "\n")
        if (element && element.videoOutput.output) {
            let startTime = element.templateConfig.params.startTime || 0;
            startTime -= element.templateConfig.params.timeOffset || 0;
            let xPosition = element.templateConfig.params.videoPosition.x || 0;
            let yPosition = element.templateConfig.params.videoPosition.y || 0;
            console.log(xPosition, yPosition);
            var offsets = element.templateConfig.params.positionOffset;
            if (offsets)
                xPosition -= offsets.x || 0;
            if (offsets)
                yPosition -= offsets.y || 0;
            let inputChannel1 = _inputChannel1 || 0;
            let inputChannel2 = _inputChannel2 || 1;
            let outputChannel = _outputChannel ? `[${_outputChannel}]` : '';
            videoElements.push(`-itsoffset ${startTime} -i ${element.videoOutput.output}`);
            filters.push(`[${inputChannel1}][${inputChannel2}] overlay=${xPosition}:${yPosition}${outputChannel}`);
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
    addVideoElements(res);
    let scale = "\"scale=" + video.resolution.width + ":" + video.resolution.height + "\"";
    let resizedVideoOutput = Utilities_1.PathJoin(path, "_" + videoName + ".mp4");
    let videoResizeParams = [
        ['./src/ffmpeg.exe'],
        ['-i', mainVideoDir],
        ['-vf', scale],
        ['-y', resizedVideoOutput]
    ];
    var ffmpegCommand = videoResizeParams.map(e => e.join(" ")).join(" ");
    console.log(ffmpegCommand);
    var t = child_process_1.spawnSync("powershell.exe", [ffmpegCommand]);
    console.log(t.stdout.toString());
    console.log(t.stderr.toString());
    yield Utilities_1.removeDir(mainVideoDir);
    mainVideoDir = mainVideoDir + ".mp4";
    yield fs_extra_1.renameSync(resizedVideoOutput, mainVideoDir);
    let videoParams = [
        ['./src/ffmpeg.exe'],
        //['-t', duration],
        ['-i', mainVideoDir],
        videoElements,
        ['-filter_complex', '"', filters.join("; "), '"'],
        ['-y'],
        [outVideoDir]
    ];
    var ffmpegCommand = videoParams.map(e => e.join(" ")).join(" ");
    console.log(ffmpegCommand);
    var t = child_process_1.spawnSync("powershell.exe", [ffmpegCommand]);
    console.log(t.stdout.toString());
    console.log(t.stderr.toString());
});
