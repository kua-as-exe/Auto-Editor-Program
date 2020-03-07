import { IPlugin, ITemplate } from './src/Interfaces';
import { writeTemplate } from './src/VideoElement';
import { PluginList } from './src/Declarations';
import { copySync, existsSync, removeSync } from 'fs-extra';
import { join } from 'path';
var express = require('express')
var http = require('http')
var reload = require('reload')
var bodyParser = require('body-parser')
var logger = require('morgan')
var watch = require('watch')
 
var app = express()

const currentTemplate = 'image1';
//const currentTemplate = 'simpleText';
const templateBuilderPath = './templateBuilder';
const builderPageTemplate = 'builderPageTemplate.html';
 
app.set('port', process.env.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(express.static(join(__dirname, templateBuilderPath)));
var server = http.createServer(app)

const loadPlugin = (plugin: IPlugin) => {
    let src = plugin.src || "default";
    copySync(join('src','plugins', src), join(templateBuilderPath,'plugins', src));
}

const refreshFile = () => {
    return writeTemplate({
        name: currentTemplate,
        customPath: templateBuilderPath,
        customName: 'index.html',
        customMainTemplate: join(templateBuilderPath, builderPageTemplate)
    }).then( (temp: ITemplate) => {
        const plugins: any[] = temp.plugins|| [];
        const pluginSources = PluginList.filter(plugin => plugins.includes(plugin.name))
        pluginSources.forEach( plugin => {
            if(!existsSync(join(templateBuilderPath, plugin.src || ""))) loadPlugin(plugin)
        })
    })
}

const startServer = async () => {
    const reloadReturned = await reload(app);
    server.listen(app.get('port'), () => console.log('Web server listening on port ' + app.get('port')))
    watch.watchTree(__dirname + "/templates", async () => {
        await refreshFile();
        reloadReturned.reload()
    })
}

startServer()

process.on('SIGINT', ()=> {
    server.close();
    removeSync(join(templateBuilderPath,'node_modules'))
    process.exit();
})