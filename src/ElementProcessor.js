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
const VideoElement_1 = require("./VideoElement");
const path_1 = require("path");
function asyncForEach(array, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let index = 0; index < array.length; index++) {
            yield callback(array[index], index, array);
        }
    });
}
class ElementProcessor {
    constructor(id, config) {
        this.mainPath = "processors";
        this.elements = [];
        this.preserveProccess = false;
        this.log = false;
        this.add = (videoElement) => {
            videoElement.id = this.elements.length;
            this.elements.push(videoElement);
        };
        this.processElements = () => new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let processedElements = [];
            yield asyncForEach(this.elements, (videoElement) => __awaiter(this, void 0, void 0, function* () {
                var e = yield VideoElement_1.processElement(videoElement, {
                    customDir: path_1.join(this.mainPath, this.customPath),
                    preserveProccess: this.preserveProccess,
                    log: this.log
                });
                processedElements.push(e);
            }));
            resolve(processedElements);
        }));
        this.id = id;
        this.customPath = `processor_${id}`;
        if (config) {
            this.customPath = config.customDir || this.customPath;
            this.preserveProccess = config.preserveProccess || false;
            this.log = config.log || false;
        }
    }
}
exports.ElementProcessor = ElementProcessor;
