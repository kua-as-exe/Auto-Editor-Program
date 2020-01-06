import { readFileSync, writeFileSync, existsSync} from 'fs';
import { Plugin, Template } from './Interfaces';
import { PluginList } from './Declarations';
const mergeJSON = require('merge-json').merge;

let fileNumber = 0;

export function writeTemplate(template: Template): Promise<Template>{
    const path = `templates/${template.name}/${template.name}`;
    const getFile = (path: string):string => existsSync(path)? readFileSync(path, 'utf8'): '';
    const getCSS = ():string => getFile(`${path}.css`) + (template.css? template.css : '');
    const getHTML = ():string => getFile(`${path}.html`) + (template.html? template.html : '');
    const getJAVASCRIPT = ():string => getFile(`${path}.js`) + (template.javascript? template.javascript : '');
    const existPlugin = (plugin: Plugin): boolean | undefined => template.plugins && template.plugins.includes(plugin.name)
    const getJSON = ():Object => existsSync(`${path}.json`)? JSON.parse(readFileSync(`${path}.json`, 'utf8')) : {};
    const appendConfigPlugins = (plugins: string[]) => {
            template.plugins = template.plugins ? 
                    template.plugins.concat(plugins) 
                    : template.plugins = plugins;
    };
    
    const getPlugins = ():string => 
            template.plugins? 
            PluginList
                .filter( plugin => existPlugin(plugin) )
                .map( plugin => plugin.tag )
                .join('\n')
            : '';

    return new Promise<Template>( (resolve, reject) => {
        if(existsSync(`templates/${template.name}`)) {
            let mainTemplate: string = getFile(template.customMainTemplate? template.customMainTemplate : `templates/mainTemplate.html`);
            let config: any = getJSON(); 

            if(config.plugins) appendConfigPlugins(config.plugins);
            mainTemplate = mainTemplate.replace(`<!--PLUGINS-->`, getPlugins());
            mainTemplate = mainTemplate.replace(`/*STYLES*/`, getCSS());
            mainTemplate = mainTemplate.replace(`<!--HTML-->`, getHTML());
            mainTemplate = mainTemplate.replace(`/*SCRIPTS*/`, getJAVASCRIPT());

            if(!template.params) template.params = {};
            template.params = mergeJSON(config.defParams, template.params); // el segundo parámetro domina el primero

            if(template.params) mainTemplate = mainTemplate.replace(`{ /*PARAMS*/}`, JSON.stringify(template.params));

            const fileName = template.customName? template.customName: `temp${fileNumber}.html`;
            const path = template.customPath? template.customPath: 'recorder';
            template.outputUrl = `${path}/${fileName}`;
            writeFileSync(template.outputUrl, mainTemplate);
            template.processed = true;
            template.fileName = fileName;
            fileNumber++;
            resolve(template);
        }else reject('template not found: ' + template.name)
    })
}