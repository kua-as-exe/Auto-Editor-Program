import { writeTemplate } from './src/Templates';
import { RecordConfig, Template } from './src/Interfaces';
import { basename, join } from 'path';
const timecut = require('timecut');
const isUndefined = require("is-undefined");


writeTemplate({
    name: 'simpleText', 
    params: {
        'text': 'Vamos bien, vamos bien',
        'duration': 15
    }
})
.then( (file: Template) => {
    console.log(file); 
    let dir = './recorder';
    let filename = file.fileName? basename(file.fileName, '.html'): '';

    let config: RecordConfig = {
        inputUrl: file.outputUrl || "",
        outNameFile: join(dir, filename),
        duration: file.params.duration || 3,
        width: file.params.width,
        height: file.params.height,
        transparent: true,
    }
    console.log(recordTemplate(config))
})
.catch( (err) => {console.log(err)} );

const  recordTemplate = (config: RecordConfig) => {
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
    console.log('\n Final Options:')
    console.log(options)
    return timecut(options)
};