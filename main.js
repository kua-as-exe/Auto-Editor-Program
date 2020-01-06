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
const util_1 = require("util");
const processElement = (_element, _dir) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        if (util_1.isUndefined(_element))
            reject("Element its undefined: " + JSON.stringify(_element));
        let dir = _dir || './recorder';
        let element = _element;
        let htmlFile = yield Templates_1.writeTemplate(element.templateConfig);
        let filename = path_1.basename(htmlFile.fileName || '', '.html');
        element.recordConfig = {
            inputUrl: htmlFile.outputUrl || "",
            outNameFile: path_1.join(dir, filename),
            duration: htmlFile.params.duration || 3,
            width: htmlFile.params.width,
            height: htmlFile.params.height,
            transparent: true,
        };
        element.videoOutput = yield TemplateRecorder_1.recordTemplate(element.recordConfig);
        resolve(element);
    }));
};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    processElement({
        templateConfig: {
            name: 'simpleText',
            params: {
                'text': 'Vamos bien, vamos bien',
                'duration': 1
            }
        }
    }).then((result) => {
        console.log(result);
    });
});
main();
