"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const Declarations_1 = require("./Declarations");
let fileNumber = 0;
function writeTemplate(template) {
    const path = `templates/${template.name}/${template.name}`;
    const getFile = (path) => fs_1.existsSync(path) ? fs_1.readFileSync(path, 'utf8') : '';
    const getCSS = () => getFile(`${path}.css`) + (template.css ? template.css : '');
    const getHTML = () => getFile(`${path}.html`) + (template.html ? template.html : '');
    const getJAVASCRIPT = () => getFile(`${path}.js`) + (template.javascript ? template.javascript : '');
    const existPlugin = (plugin) => template.plugins && template.plugins.includes(plugin.name);
    const getJSON = () => fs_1.existsSync(`${path}.json`) ? JSON.parse(fs_1.readFileSync(`${path}.json`, 'utf8')) : {};
    const appendConfigPlugins = (config) => {
        if (config.plugins)
            template.plugins = template.plugins ?
                template.plugins.concat(config.plugins)
                : template.plugins = config.plugins;
    };
    const getPlugins = () => template.plugins ?
        Declarations_1.PluginList
            .filter(plugin => existPlugin(plugin))
            .map(plugin => plugin.tag)
            .join('\n')
        : '';
    return new Promise((resolve, reject) => {
        if (fs_1.existsSync(`templates/${template.name}`)) {
            let mainTemplate = getFile(`templates/mainTemplate.html`);
            appendConfigPlugins(getJSON());
            mainTemplate = mainTemplate.replace(`<!--PLUGINS-->`, getPlugins());
            mainTemplate = mainTemplate.replace(`/*STYLES*/`, getCSS());
            mainTemplate = mainTemplate.replace(`<!--HTML-->`, getHTML());
            mainTemplate = mainTemplate.replace(`/*SCRIPTS*/`, getJAVASCRIPT());
            if (template.params)
                mainTemplate = mainTemplate.replace(`{ /*PARAMS*/}`, JSON.stringify(template.params));
            const fileName = template.customName ? template.customName : `temp${fileNumber}.html`;
            const path = template.customPath ? template.customPath : 'recorder';
            fs_1.writeFileSync(`${path}/${fileName}`, mainTemplate);
            template.processed = true;
            template.fileName = fileName;
            fileNumber++;
            resolve(template);
        }
        else
            reject('template not found: ' + template.name);
    });
}
exports.writeTemplate = writeTemplate;
