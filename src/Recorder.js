"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utilities_1 = require("./Utilities");
const child_process_1 = require("child_process");
const chalk_1 = __importDefault(require("chalk"));
//import * as timesnap from 'timesnap';
const timesnap = require('timesnap');
exports.RecordHTMLFile = (options) => {
    return record(options);
};
function record(config) {
    config = Object.assign({
        roundToEvenWidth: true,
        roundToEvenHeight: true,
    }, config || {});
    var output = Utilities_1.PathResolve(process.cwd(), config.output || 'video.mp4');
    //var output = config.output
    var frameDirectory;
    var outputPattern;
    var convertProcess;
    frameDirectory = 'timecut-' + (config.keepFrames ? 'frames-' : 'temp-') + (new Date()).getTime();
    frameDirectory = Utilities_1.PathJoin(Utilities_1.PathParse(output).dir, frameDirectory);
    outputPattern = Utilities_1.PathJoin(frameDirectory, 'image-%09d.png');
    var timesnapConfig = Object.assign({}, config, {
        output: '',
        outputPattern: outputPattern
    });
    const log = (...args) => {
        if (!config.quiet)
            console.log.apply(null, [args]);
    };
    var makeProcessPromise = function () {
        var input = outputPattern;
        let ffmpegArguments = [
            '-framerate', String(config.fps),
            '-i', input,
            '-vcodec', 'ffvhuff',
            '-y', output
        ];
        convertProcess = child_process_1.spawn('./src/ffmpeg.exe', ffmpegArguments);
        convertProcess.stderr.setEncoding('utf8');
        convertProcess.stderr.on('data', log);
        convertProcess.stderr.on('error', (err) => log(chalk_1.default.red(err)));
        convertProcess.on('error', (err) => log(chalk_1.default.red(err)));
        return new Promise(function (resolve, reject) {
            convertProcess.on('close', () => resolve());
            convertProcess.on('error', (err) => reject(err));
            convertProcess.stdin.on('error', (err) => reject(err));
        });
    };
    return new Promise((resolve, reject) => {
        const res = timesnap(timesnapConfig)
            .then(() => {
            makeProcessPromise()
                .then(() => {
                if (!config.keepFrames)
                    Utilities_1.removeDir(frameDirectory);
                convertProcess.stdin.end();
                resolve("True");
            })
                .catch((err) => log(err));
        });
    });
}
exports.record = record;
