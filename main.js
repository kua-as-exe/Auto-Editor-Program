"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Templates_1 = require("./src/Templates");
const path_1 = require("path");
const timecut = require('timecut');
const isUndefined = require("is-undefined");
Templates_1.writeTemplate({
    name: 'simpleText',
    params: {
        'text': 'Vamos bien, vamos bien',
        'duration': 15
    }
})
    .then((file) => {
    console.log(file);
    let dir = './recorder';
    let filename = file.fileName ? path_1.basename(file.fileName, '.html') : '';
    let config = {
        inputUrl: file.outputUrl || "",
        outNameFile: path_1.join(dir, filename),
        duration: file.params.duration || 3,
        width: file.params.width,
        height: file.params.height,
        transparent: true,
    };
    console.log(recordTemplate(config));
})
    .catch((err) => { console.log(err); });
const recordTemplate = (config) => {
    if (isUndefined(config.transparent))
        config.transparent = false;
    const getOutputFile = () => config.outNameFile + (config.transparent ? '.avi' : '.mp4');
    if (typeof config.width == 'string')
        config.width = Number(String(config.width).replace('px', ''));
    if (typeof config.height == 'string')
        config.height = Number(String(config.height).replace('px', ''));
    let options = {
        url: config.inputUrl,
        viewport: { width: config.width, height: config.height },
        fps: config.fps ? config.fps : 25,
        duration: config.duration,
        keepFrames: config.keepFrames || false,
        output: getOutputFile(),
    };
    if (config.transparent) {
        options.outputOptions = ['-vcodec', 'ffvhuff'];
        options.transparentBackground = true;
        options.pixFmt = '';
    }
    console.log('\n Final Options:');
    console.log(options);
    return timecut(options);
};
