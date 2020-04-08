import { ITemplate, IVideoElement, IElementConfig, IRecordConfig } from './Interfaces';
import { getJSON, getFile, pluginsUtilities, getOrCreateDir, Color, PathJoin} from './Utilities';
import { RecordHTMLFile } from './Recorder';

import { writeFileSync, existsSync, unlinkSync} from 'fs';
import { basename } from 'path';
import { isUndefined } from 'util';

//const timecut = require('timecut');
const mergeJSON = require('merge-json').merge;
import Ora from 'ora';
import chalk from 'chalk';



let fileNumber = 0;
const spinner = Ora();
let prefixText = '';

const spinnerText = (text: string) => {
    spinner.prefixText = 
        `${prefixText} ${Color.cyan('[')} ${Color.yellow(text)} ${Color.cyan(']')}`;
}

export const writeTemplate = (template: ITemplate, customDir?: string): Promise<ITemplate> => {
    spinnerText("Writing HTML");
    const path = PathJoin('templates',template.name,template.name);
    const getCSS = ():string => getFile(`${path}.css`) + (template.css || '');
    const getHTML = ():string => getFile(`${path}.html`) + (template.html || '');
    const getJAVASCRIPT = ():string => getFile(`${path}.js`) + (template.javascript || '');
    
    const appendConfigPlugins = (plugins: string[]) => {
            template.plugins = template.plugins ? 
                    template.plugins.concat(plugins) 
                    : template.plugins = plugins;
    };

    return new Promise<ITemplate>( (resolve, reject) => {
        if(existsSync(`templates/${template.name}`)) {
            let mainTemplate: string = getFile(template.customMainTemplate || `templates/mainTemplate.html`);
            let config: any = getJSON( PathJoin('templates',template.name,template.name) + '.json'); 

            if(config.plugins) appendConfigPlugins(config.plugins);
            mainTemplate = mainTemplate.replace(`<!--PLUGINS-->`, pluginsUtilities.getTags(template.plugins || []));
            mainTemplate = mainTemplate.replace(`/*STYLES*/`, getCSS());
            mainTemplate = mainTemplate.replace(`<!--HTML-->`, getHTML());
            mainTemplate = mainTemplate.replace(`/*SCRIPTS*/`, getJAVASCRIPT());

            if(!template.params) template.params = {};
            template.params = mergeJSON(config.defParams, template.params); // el segundo parámetro domina el primero
            template.params = mergeJSON({'templateName': template.name }, template.params);//añade el nombre de la plantilla como parámetro
            
            if(template.params) mainTemplate = mainTemplate.replace(`{ /*PARAMS*/}`, JSON.stringify(template.params)); 

            const fileName = template.customName || `temp${fileNumber}.html`;
            const path = template.customPath || 'recorder';
            template.outputUrl = PathJoin(path, fileName);
            writeFileSync(template.outputUrl, mainTemplate);
            template.processed = true;
            template.fileName = fileName;
            fileNumber++;
            resolve(template);
        }else reject('template not found: ' + template.name)
    })
}

export const recordTemplate = async (config: IRecordConfig, log?: boolean): Promise<any> => {
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

    console.log(options)

    if(config.transparent) {
        options.outputOptions = ['-vcodec', 'ffvhuff'];
        options.transparentBackground = true;
        options.pixFmt = '';
    }

    return new Promise( (resolve, reject) => {
        console.log(chalk.green("Timecut:"), options);
        RecordHTMLFile(options)
        .then( () => {
            console.log(chalk.red('\nAquí llegamos compas\n'))
            if(config && !config.keepFrames) unlinkSync(config.inputUrl);
            resolve(options)
        })
        .catch( (err: any) => {
            console.error(chalk.red(err))
            reject(err);
        });
    });
};

export const processElement = (_element: IVideoElement, config?: IElementConfig): Promise<IVideoElement> => {
    spinner.start(); prefixText = `${Color.cyan(_element.templateConfig.name)}`;
    return new Promise ( async (resolve, reject ) => {
        let element: IVideoElement = _element;

        if(isUndefined(_element)) reject("Element its undefined: "+ JSON.stringify(_element));
        let dir = 'videoElements';
        if(config && config.customDir) {
            dir = PathJoin(config.customDir,dir);
            element.templateConfig.customPath = dir;
        }

        //if (dir && !existsSync(dir)) mkdirSync(dir, { recursive: true }); // create path if dont exists
        await getOrCreateDir(dir)

        let htmlFile: ITemplate = await writeTemplate(element.templateConfig);
        let filename = basename(htmlFile.fileName || '', '.html');

        element.recordConfig = {
            inputUrl: htmlFile.outputUrl || "",
            outNameFile: PathJoin(dir, filename),
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
        spinner.succeed(`Template proccessed: ${Color.green(element.templateConfig.name)}`)
        
        resolve(element);
    })
}