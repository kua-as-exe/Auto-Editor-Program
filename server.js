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
const Templates_1 = require("./src/Templates");
const Declarations_1 = require("./src/Declarations");
const fs_extra_1 = require("fs-extra");
var express = require('express');
var http = require('http');
var path = require('path');
var reload = require('reload');
var bodyParser = require('body-parser');
var logger = require('morgan');
var watch = require('watch');
var app = express();
const currentTemplate = 'simpleText';
const templateBuilderPath = './templateBuilder';
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, templateBuilderPath)));
var server = http.createServer(app);
//var loadedPlugins: Plugin[] = [];
const loadPlugin = (plugin) => {
    fs_extra_1.copySync(path.join('./', plugin.src), path.join(templateBuilderPath, plugin.src));
    //loadedPlugins.push(plugin);
};
/*
const unLoadPlugin = (plugin: Plugin) => {
    console.log(path.join(templateBuilderPath, path.parse(plugin.src).dir.split('/')[1]))
    unlinkSync(path.join(templateBuilderPath, plugin.src));
    delete loadedPlugins[loadedPlugins.indexOf(plugin)];
}*/
const refreshFile = () => {
    return Templates_1.writeTemplate({
        name: currentTemplate,
        customPath: templateBuilderPath,
        customName: 'index.html',
        html: `<script src="/reload/reload.js"></script>`,
        css: `
            main {
                width: 450px; height: 150px;
                background-image: url(assets/transparentBG.jpg);
            }
            container{
                box-shadow: 0px 10px 20px 2px black;
                padding: 8px;
                background: #ffffff;
                border-radius: 3px;
            }
            body {
                margin: 0;
                padding: 0;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                background-image: linear-gradient(45deg, #434343 0%, #29323c 100%);
            }
        `,
        javascript: '\nsetTimeout( ()=>{document.body.style.display = "flex";}, 100);'
    }).then((temp) => {
        const plugins = temp.plugins ? temp.plugins : [];
        const pluginSources = Declarations_1.PluginList.filter(plugin => plugins.includes(plugin.name));
        pluginSources.forEach(plugin => {
            if (!fs_extra_1.existsSync(path.join(templateBuilderPath, plugin.src)))
                loadPlugin(plugin);
        });
    });
};
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const reloadReturned = yield reload(app);
    server.listen(app.get('port'), () => console.log('Web server listening on port ' + app.get('port')));
    watch.watchTree(__dirname + "/templates", () => __awaiter(void 0, void 0, void 0, function* () {
        yield refreshFile();
        reloadReturned.reload();
    }));
});
startServer();
process.on('SIGINT', () => {
    server.close();
    fs_extra_1.removeSync(path.join(templateBuilderPath, 'node_modules'));
    process.exit();
});
