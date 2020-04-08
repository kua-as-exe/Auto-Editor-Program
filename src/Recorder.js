"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utilities_1 = require("./Utilities");
const child_process_1 = require("child_process");
//import * as timesnap from 'timesnap';
const timesnap = require('timesnap');
exports.RecordHTMLFile = (options) => {
    return new Promise((resolve, reject) => {
        console.log(options);
    });
};
function record(config) {
    config = Object.assign({
        roundToEvenWidth: true,
        roundToEvenHeight: true,
    }, config || {});
    console.log(config);
    var output = Utilities_1.PathResolve(process.cwd(), config.output || 'video.mp4');
    var frameDirectory;
    var outputPattern;
    var convertProcess;
    frameDirectory = 'timecut-' + (config.keepFrames ? 'frames-' : 'temp-') + (new Date()).getTime();
    frameDirectory = Utilities_1.PathResolve(Utilities_1.PathParse(output).dir);
    outputPattern = Utilities_1.PathResolve(frameDirectory, 'image-%09d.png');
    var timesnapConfig = Object.assign({}, config, {
        output: '',
        outputPattern: outputPattern
    });
    const log = (...args) => {
        if (!config.quiet)
            console.log.apply(null, [args]);
    };
    var makeProcessPromise = function () {
        //makeFileDirectoryIfNeeded(output);
        Utilities_1.getOrCreateDir(output);
        var input = outputPattern;
        let ffmpegArguments = [
            '-framerate', String(config.fps),
            '-i', input.replace(/\\/g, "/"),
            '-vcodec', 'ffvhuff',
            '-y', output.replace(/\\/g, "/")
        ];
        convertProcess = child_process_1.spawn('ffmpeg.exe', ffmpegArguments);
        convertProcess.stderr.setEncoding('utf8');
        convertProcess.stderr.on('data', (data) => log(data));
        return new Promise(function (resolve, reject) {
            convertProcess.on('close', () => resolve());
            convertProcess.on('error', (err) => reject(err));
            convertProcess.stdin.on('error', (err) => reject(err));
        });
    };
    return timesnap(timesnapConfig)
        .then(() => { if (convertProcess)
        convertProcess.stdin.end(); })
        .then(makeProcessPromise())
        .catch((err) => log(err))
        .then(() => {
        if (!config.keepFrames)
            Utilities_1.removeDir(frameDirectory);
    });
}
exports.record = record;
