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
const VideoElement_1 = require("./src/VideoElement");
const Declarations_1 = require("./src/Declarations");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const Utilities_1 = require("./src/Utilities");
var express = require('express');
var http = require('http');
var reload = require('reload');
var bodyParser = require('body-parser');
var logger = require('morgan');
var watch = require('watch');
var app = express();
const currentTemplate = 'image1';
//const currentTemplate = 'simpleText';
const templateBuilderPath = './templateBuilder';
const builderPageTemplate = 'builderPageTemplate.html';
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path_1.join(__dirname, templateBuilderPath)));
var server = http.createServer(app);
const loadPlugin = (plugin) => {
    let src = plugin.src || "default";
    fs_extra_1.copySync(path_1.join('src', 'plugins', src), path_1.join(templateBuilderPath, 'plugins', src));
};
const loadAsset = (asset, template) => {
    var name = asset.name || "";
    var src = asset.src || "./";
    var type = asset.type || "file";
    var def = asset.default || src;
    var fullSrc = (type == "file") ? Utilities_1.PathJoin('./', template.name, src) : src; // aquí puede haber un error en caso de haber varios elementos de la misma plantilla
    Utilities_1.getOrCreateDir(Utilities_1.PathJoin(templateBuilderPath, 'assets', template.name));
    console.log(src);
    if (name && src)
        fs_extra_1.copySync(path_1.join('templates', template.name, 'assets', def), path_1.join(templateBuilderPath, 'assets', fullSrc));
};
const refreshFile = () => {
    return VideoElement_1.writeTemplate({
        //debería añadir un "id" por aquí
        name: currentTemplate,
        customPath: templateBuilderPath,
        customName: 'index.html',
        customMainTemplate: path_1.join(templateBuilderPath, builderPageTemplate)
    }).then((temp) => {
        const plugins = temp.plugins || [];
        const pluginSources = Declarations_1.PluginList.filter(plugin => plugins.includes(plugin.name));
        pluginSources.forEach(plugin => {
            if (!fs_extra_1.existsSync(path_1.join(templateBuilderPath, plugin.src || "")))
                loadPlugin(plugin);
        });
        let template_assets = temp.assets;
        if (template_assets) {
            Utilities_1.getOrCreateDir(Utilities_1.PathJoin(templateBuilderPath, "assets"));
            template_assets.forEach(asset => loadAsset(asset, temp));
        }
    });
};
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const reloadReturned = yield reload(app);
    server.listen(app.get('port'), () => console.log('Web server listening on port ' + app.get('port')));
    //execSync('start http://localhost:'+app.get('port') )
    watch.watchTree(__dirname + "/templates", () => __awaiter(void 0, void 0, void 0, function* () {
        yield refreshFile();
        reloadReturned.reload();
    }));
});
startServer();
process.on('SIGINT', () => {
    server.close();
    fs_extra_1.removeSync(path_1.join(templateBuilderPath, 'node_modules'));
    process.exit();
});
