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
const TemplateRecorder_1 = require("./src/TemplateRecorder");
const Templates_1 = require("./src/Templates");
const path_1 = require("path");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const element = {
        templateConfig: {
            name: 'simpleText',
            params: {
                'text': 'Vamos bien, vamos bien',
                'duration': 1
            }
        }
    };
    let file = yield Templates_1.writeTemplate(element.templateConfig);
    let dir = './recorder';
    let filename = path_1.basename(file.fileName || '', '.html');
    element.recordConfig = {
        inputUrl: file.outputUrl || "",
        outNameFile: path_1.join(dir, filename),
        duration: file.params.duration || 3,
        width: file.params.width,
        height: file.params.height,
        transparent: true,
    };
    let videoOutput = yield TemplateRecorder_1.recordTemplate(element.recordConfig);
    element.videoOutput = videoOutput;
    console.log(element);
});
main();
