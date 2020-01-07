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
const fs_1 = require("fs");
const Declarations_1 = require("./Declarations");
const path_1 = require("path");
const util_1 = require("util");
const mergeJSON = require('merge-json').merge;
const timecut = require('timecut');
let fileNumber = 0;
exports.writeTemplate = (template) => {
    const path = `templates/${template.name}/${template.name}`;
    const getFile = (path) => fs_1.existsSync(path) ? fs_1.readFileSync(path, 'utf8') : '';
    const getCSS = () => getFile(`${path}.css`) + (template.css || '');
    const getHTML = () => getFile(`${path}.html`) + (template.html || '');
    const getJAVASCRIPT = () => getFile(`${path}.js`) + (template.javascript || '');
    const existPlugin = (plugin) => template.plugins && template.plugins.includes(plugin.name);
    const getJSON = () => fs_1.existsSync(`${path}.json`) ? JSON.parse(fs_1.readFileSync(`${path}.json`, 'utf8')) : {};
    const appendConfigPlugins = (plugins) => {
        template.plugins = template.plugins ?
            template.plugins.concat(plugins)
            : template.plugins = plugins;
    };
    const getPlugins = () => template.plugins ?
        Declarations_1.PluginList
            .filter(plugin => existPlugin(plugin))
            .map(plugin => plugin.tag)
            .join('\n')
        : '';
    return new Promise((resolve, reject) => {
        if (fs_1.existsSync(`templates/${template.name}`)) {
            let mainTemplate = getFile(template.customMainTemplate || `templates/mainTemplate.html`);
            let config = getJSON();
            if (config.plugins)
                appendConfigPlugins(config.plugins);
            mainTemplate = mainTemplate.replace(`<!--PLUGINS-->`, getPlugins());
            mainTemplate = mainTemplate.replace(`/*STYLES*/`, getCSS());
            mainTemplate = mainTemplate.replace(`<!--HTML-->`, getHTML());
            mainTemplate = mainTemplate.replace(`/*SCRIPTS*/`, getJAVASCRIPT());
            if (!template.params)
                template.params = {};
            template.params = mergeJSON(config.defParams, template.params); // el segundo parámetro domina el primero
            if (template.params)
                mainTemplate = mainTemplate.replace(`{ /*PARAMS*/}`, JSON.stringify(template.params));
            const fileName = template.customName || `temp${fileNumber}.html`;
            const path = template.customPath || 'recorder';
            template.outputUrl = `${path}/${fileName}`;
            fs_1.writeFileSync(template.outputUrl, mainTemplate);
            template.processed = true;
            template.fileName = fileName;
            fileNumber++;
            resolve(template);
        }
        else
            reject('template not found: ' + template.name);
    });
};
exports.recordTemplate = (config) => __awaiter(void 0, void 0, void 0, function* () {
    if (util_1.isUndefined(config.transparent))
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
    return new Promise((resolve, reject) => {
        timecut(options)
            .then(() => resolve(options))
            .catch((err) => reject(err));
    });
});
exports.processElement = (_element, _dir) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        if (util_1.isUndefined(_element))
            reject("Element its undefined: " + JSON.stringify(_element));
        let dir = _dir || './recorder';
        let element = _element;
        let htmlFile = yield exports.writeTemplate(element.templateConfig);
        let filename = path_1.basename(htmlFile.fileName || '', '.html');
        element.recordConfig = {
            inputUrl: htmlFile.outputUrl || "",
            outNameFile: path_1.join(dir, filename),
            duration: htmlFile.params.duration || 3,
            fps: htmlFile.params.fps || 25,
            width: htmlFile.params.width,
            height: htmlFile.params.height,
            transparent: true,
        };
        element.videoOutput = yield exports.recordTemplate(element.recordConfig);
        resolve(element);
    }));
};
