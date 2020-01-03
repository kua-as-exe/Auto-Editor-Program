"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const pluginList = [
    { name: 'bootstrap', tag: `<link rel="stylesheet" href="../node_modules/bootstrap/dist/css/bootstrap.min.css">` },
    { name: 'anime.js', tag: `<script src="../node_modules/animejs/lib/anime.min.js"></script>` }
];
let fileNumber = 0;
function writeTemplate(template) {
    const path = `templates/${template.name}/${template.name}`;
    const getFile = (path) => fs_1.existsSync(path) ? fs_1.readFileSync(path, 'utf8') : '';
    const getCSS = () => template.css ? template.css : getFile(`${path}.css`);
    const getHTML = () => template.html ? template.html : getFile(`${path}.html`);
    const getJAVASCRIPT = () => template.javascript ? template.javascript : getFile(`${path}.js`);
    const existPlugin = (plugin) => template.plugins && template.plugins.includes(plugin.name);
    const getPlugins = () => template.plugins ?
        pluginList
            .filter(plugin => existPlugin(plugin))
            .map(plugin => plugin.tag)
            .join('\n')
        : '';
    return new Promise((resolve, reject) => {
        if (fs_1.existsSync(`templates/${template.name}`)) {
            let mainTemplate = getFile(`templates/mainTemplate.html`);
            mainTemplate = mainTemplate.replace(`<!--PLUGINS-->`, getPlugins());
            mainTemplate = mainTemplate.replace(`/*STYLES*/`, getCSS());
            mainTemplate = mainTemplate.replace(`<!--HTML-->`, getHTML());
            mainTemplate = mainTemplate.replace(`/*SCRIPTS*/`, getJAVASCRIPT());
            if (template.params)
                mainTemplate = mainTemplate.replace(`{ /*PARAMS*/}`, JSON.stringify(template.params));
            fs_1.writeFileSync(`recorder/${fileNumber}.html`, mainTemplate);
            fileNumber++;
            template.processed = true;
            resolve(template);
        }
        else
            reject('template not found: ' + template.name);
    });
}
writeTemplate({
    name: 'simpleText',
    params: { 'title': 'New day' },
    plugins: ['bootstrap', 'anime.js']
}).then((res) => {
    console.log(res);
}).catch((err) => { console.log(err); });
writeTemplate({
    name: 'simpleText',
    params: { 'title': 'Éxito éxito éxito', 'color1': 'rgb(255,255,0)' },
    plugins: ['anime.js']
}).then((res) => {
    console.log(res);
}).catch((err) => { console.log(err); });
