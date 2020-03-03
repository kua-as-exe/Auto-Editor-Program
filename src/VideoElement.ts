import { Template, VideoElement, Plugin, ElementConfig } from './Interfaces';
import { readFileSync, writeFileSync, existsSync, unlinkSync, mkdirSync} from 'fs';
import { RecordConfig } from "./Interfaces";
import { PluginList } from './Declarations';
import { basename, join } from 'path';
import { isUndefined } from 'util';
import { red, cyan, green, yellow, white, magenta} from 'chalk';

const timecut = require('timecut');
const mergeJSON = require('merge-json').merge;
import Ora from 'ora';



let fileNumber = 0;
const spinner = Ora();
let prefixText = '';

const spinnerText = (text: string) => {
    spinner.prefixText = 
        `${prefixText} ${cyan('[')} ${yellow(text)} ${cyan(']')}`;
}

export const writeTemplate = (template: Template, customDir?: string): Promise<Template> => {
    spinnerText("Writing HTML");
    const path = join('templates',template.name,template.name);
    const getFile = (path: string):string => existsSync(path)? readFileSync(path, 'utf8'): '';
    const getCSS = ():string => getFile(`${path}.css`) + (template.css || '');
    const getHTML = ():string => getFile(`${path}.html`) + (template.html || '');
    const getJAVASCRIPT = ():string => getFile(`${path}.js`) + (template.javascript || '');
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
            let mainTemplate: string = getFile(template.customMainTemplate || `templates/mainTemplate.html`);
            let config: any = getJSON(); 

            if(config.plugins) appendConfigPlugins(config.plugins);
            mainTemplate = mainTemplate.replace(`<!--PLUGINS-->`, getPlugins());
            mainTemplate = mainTemplate.replace(`/*STYLES*/`, getCSS());
            mainTemplate = mainTemplate.replace(`<!--HTML-->`, getHTML());
            mainTemplate = mainTemplate.replace(`/*SCRIPTS*/`, getJAVASCRIPT());

            if(!template.params) template.params = {};
            template.params = mergeJSON(config.defParams, template.params); // el segundo parámetro domina el primero
            template.params = mergeJSON({'templateName': template.name }, template.params);//añade el nombre de la plantilla como parámetro
            
            if(template.params) mainTemplate = mainTemplate.replace(`{ /*PARAMS*/}`, JSON.stringify(template.params)); 

            const fileName = template.customName || `temp${fileNumber}.html`;
            const path = template.customPath || 'recorder';
            template.outputUrl = `${path}/${fileName}`;
            writeFileSync(template.outputUrl, mainTemplate);
            template.processed = true;
            template.fileName = fileName;
            fileNumber++;
            resolve(template);
        }else reject('template not found: ' + template.name)
    })
}

export const recordTemplate = async (config: RecordConfig, log?: boolean): Promise<any> => {
    spinnerText("Recording");
    if(isUndefined(config.transparent)) config.transparent = false;
    const getOutputFile = () => config.outNameFile + (config.transparent? '.avi': '.mp4');
    if(typeof config.width == 'string') config.width = Number(String(config.width).replace('px', ''));
    if(typeof config.height == 'string') config.height = Number(String(config.height).replace('px', ''));

    let options: any = {
        url: config.inputUrl,
        viewport: { width: config.width, height: config.height },
        fps: config.fps? config.fps : 25, 
        duration: config.duration, 
        keepFrames: config.keepFrames || false,
        output: getOutputFile(),
        quiet: !log || false
    };

    if(config.transparent) {
        options.outputOptions = ['-vcodec', 'ffvhuff'];
        options.transparentBackground = true;
        options.pixFmt = '';
    }

    return new Promise( (resolve, reject) => {
        
        timecut(options)
        .then( () => {
            if(config && !config.keepFrames) unlinkSync(config.inputUrl);
            resolve(options)
        })
        .catch( (err: any) => reject(err));
    });
};

export const processElement = (_element: VideoElement, config?: ElementConfig): Promise<VideoElement> => {
    spinner.start(); prefixText = `${cyan(_element.templateConfig.name)}`;
    return new Promise ( async (resolve, reject ) => {
        let element: VideoElement = _element;

        if(isUndefined(_element)) reject("Element its undefined: "+ JSON.stringify(_element));
        let dir = 'recorder';
        if(config && config.customDir) {
            dir = join(config.customDir,dir);
            element.templateConfig.customPath = dir;
        }

        if (dir && !existsSync(dir)) mkdirSync(dir, { recursive: true }); // create path if dont exists

        let htmlFile: Template = await writeTemplate(element.templateConfig);
        let filename = basename(htmlFile.fileName || '', '.html');

        element.recordConfig = {
            inputUrl: htmlFile.outputUrl || "",
            outNameFile: join(dir, filename),
            duration: htmlFile.params.duration || 3,
            fps: htmlFile.params.fps || 25,
            width: htmlFile.params.width,
            height: htmlFile.params.height,
            transparent: true,
        };

        const log = config && config.log || false;
        if(config && config.preserveProccess) element.recordConfig.keepFrames = config.preserveProccess
        element.videoOutput = await recordTemplate(element.recordConfig, log);
        spinnerText('Done'); 
        spinner.succeed(`Template proccessed: ${green(element.templateConfig.name)}`)
        resolve(element);
    })
}