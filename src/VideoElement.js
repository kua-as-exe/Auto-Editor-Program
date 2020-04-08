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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utilities_1 = require("./Utilities");
const Recorder_1 = require("./Recorder");
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("util");
//const timecut = require('timecut');
const mergeJSON = require('merge-json').merge;
const ora_1 = __importDefault(require("ora"));
const chalk_1 = __importDefault(require("chalk"));
let fileNumber = 0;
const spinner = ora_1.default();
let prefixText = '';
const spinnerText = (text) => {
    spinner.prefixText =
        `${prefixText} ${Utilities_1.Color.cyan('[')} ${Utilities_1.Color.yellow(text)} ${Utilities_1.Color.cyan(']')}`;
};
exports.writeTemplate = (template, customDir) => {
    spinnerText("Writing HTML");
    const path = Utilities_1.PathJoin('templates', template.name, template.name);
    const getCSS = () => Utilities_1.getFile(`${path}.css`) + (template.css || '');
    const getHTML = () => Utilities_1.getFile(`${path}.html`) + (template.html || '');
    const getJAVASCRIPT = () => Utilities_1.getFile(`${path}.js`) + (template.javascript || '');
    const appendConfigPlugins = (plugins) => {
        template.plugins = template.plugins ?
            template.plugins.concat(plugins)
            : template.plugins = plugins;
    };
    return new Promise((resolve, reject) => {
        if (fs_1.existsSync(`templates/${template.name}`)) {
            let mainTemplate = Utilities_1.getFile(template.customMainTemplate || `templates/mainTemplate.html`);
            let config = Utilities_1.getJSON(Utilities_1.PathJoin('templates', template.name, template.name) + '.json');
            if (config.plugins)
                appendConfigPlugins(config.plugins);
            mainTemplate = mainTemplate.replace(`<!--PLUGINS-->`, Utilities_1.pluginsUtilities.getTags(template.plugins || []));
            mainTemplate = mainTemplate.replace(`/*STYLES*/`, getCSS());
            mainTemplate = mainTemplate.replace(`<!--HTML-->`, getHTML());
            mainTemplate = mainTemplate.replace(`/*SCRIPTS*/`, getJAVASCRIPT());
            if (!template.params)
                template.params = {};
            template.params = mergeJSON(config.defParams, template.params); // el segundo parámetro domina el primero
            template.params = mergeJSON({ 'templateName': template.name }, template.params); //añade el nombre de la plantilla como parámetro
            if (template.params)
                mainTemplate = mainTemplate.replace(`{ /*PARAMS*/}`, JSON.stringify(template.params));
            const fileName = template.customName || `temp${fileNumber}.html`;
            const path = template.customPath || 'recorder';
            template.outputUrl = Utilities_1.PathJoin(path, fileName);
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
exports.recordTemplate = (config, log) => __awaiter(void 0, void 0, void 0, function* () {
    spinnerText("Recording");
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
        quiet: !log || false
    };
    console.log(options);
    if (config.transparent) {
        options.outputOptions = ['-vcodec', 'ffvhuff'];
        options.transparentBackground = true;
        options.pixFmt = '';
    }
    return new Promise((resolve, reject) => {
        console.log(chalk_1.default.green("Timecut:"), options);
        Recorder_1.RecordHTMLFile(options)
            .then(() => {
            if (config && !config.keepFrames)
                fs_1.unlinkSync(config.inputUrl);
            resolve(options);
        })
            .catch((err) => {
            console.error(chalk_1.default.red(err));
            reject(err);
        });
    });
});
exports.processElement = (_element, config) => {
    spinner.start();
    prefixText = `${Utilities_1.Color.cyan(_element.templateConfig.name)}`;
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        let element = _element;
        if (util_1.isUndefined(_element))
            reject("Element its undefined: " + JSON.stringify(_element));
        let dir = 'videoElements';
        if (config && config.customDir) {
            dir = Utilities_1.PathJoin(config.customDir, dir);
            element.templateConfig.customPath = dir;
        }
        //if (dir && !existsSync(dir)) mkdirSync(dir, { recursive: true }); // create path if dont exists
        yield Utilities_1.getOrCreateDir(dir);
        let htmlFile = yield exports.writeTemplate(element.templateConfig);
        let filename = path_1.basename(htmlFile.fileName || '', '.html');
        element.recordConfig = {
            inputUrl: htmlFile.outputUrl || "",
            outNameFile: Utilities_1.PathJoin(dir, filename),
            duration: htmlFile.params.duration || 3,
            fps: htmlFile.params.fps || 25,
            width: htmlFile.params.width,
            height: htmlFile.params.height,
            transparent: true,
        };
        const log = config && config.log || false;
        if (config && config.preserveProccess)
            element.recordConfig.keepFrames = config.preserveProccess;
        element.videoOutput = yield exports.recordTemplate(element.recordConfig, log);
        spinnerText('Done');
        spinner.succeed(`Template proccessed: ${Utilities_1.Color.green(element.templateConfig.name)}`);
        resolve(element);
    }));
};
