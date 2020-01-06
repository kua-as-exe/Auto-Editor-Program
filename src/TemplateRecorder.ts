import { RecordConfig } from "./Interfaces";
const isUndefined = require("is-undefined");
const timecut = require('timecut');

export const recordTemplate = (config: RecordConfig): Promise<any> => {
    if(isUndefined(config.transparent)) config.transparent = false;
    const getOutputFile = ()=> config.outNameFile + (config.transparent? '.avi': '.mp4');
    if(typeof config.width == 'string') config.width = Number(String(config.width).replace('px', ''));
    if(typeof config.height == 'string') config.height = Number(String(config.height).replace('px', ''));

    let options: any = {
        url: config.inputUrl,
        viewport: { width: config.width, height: config.height },
        fps: config.fps? config.fps : 25, 
        duration: config.duration, 
        keepFrames: config.keepFrames || false,
        output: getOutputFile(),
    };

    if(config.transparent) {
        options.outputOptions = ['-vcodec', 'ffvhuff'];
        options.transparentBackground = true;
        options.pixFmt = '';
    }

    return timecut(options);
};