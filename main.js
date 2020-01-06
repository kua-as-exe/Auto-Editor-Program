"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TemplateRecorder_1 = require("./src/TemplateRecorder");
const Templates_1 = require("./src/Templates");
const path_1 = require("path");
Templates_1.writeTemplate({
    name: 'simpleText',
    params: {
        'text': 'Vamos bien, vamos bien',
        'duration': 15
    }
})
    .then((file) => {
    let dir = './recorder';
    let filename = path_1.basename(file.fileName || '', '.html');
    TemplateRecorder_1.recordTemplate({
        inputUrl: file.outputUrl || "",
        outNameFile: path_1.join(dir, filename),
        duration: file.params.duration || 3,
        width: file.params.width,
        height: file.params.height,
        transparent: true,
    });
})
    .catch((err) => { console.log(err); });
