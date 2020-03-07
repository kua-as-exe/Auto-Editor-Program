import { getOrCreateDir, asyncForEach, getJSON, pluginsUtilities, copyFile, removeDir } from "./Utilities";
import { IVideoElement, IElementConfig, IPlugin } from "./Interfaces";
import { processElement } from "./VideoElement";
import { join } from "path";

export class ElementProcessor {
    private id:number;
    private mainPath: string = "processors";
    private customPath: string;
    private path: string;
    private elements: IVideoElement[] = [];
    private preserveProccess: boolean = false;
    private log: boolean = false;

    constructor(id: number, config?: IElementConfig){
        this.id = id;
        this.customPath = `processor_${id}`;
        if(config){
            this.customPath = config.customDir || this.customPath;
            this.preserveProccess = config.preserveProccess || false;
            this.log = config.log || false;
        }
        this.path = join(this.mainPath, this.customPath);
    }

    add = (videoElement: IVideoElement) => {
        videoElement.id = this.elements.length;
        this.elements.push(videoElement);
    }

    processElements = () => new Promise<IVideoElement[]>( async (resolve, reject) => {
        let processedElements: IVideoElement[] = [];

        await this.setupPlugins();
        await this.setupAssets();
        
        await asyncForEach(this.elements, async (videoElement: IVideoElement)=>{
            var e = await processElement(videoElement, {
                customDir: this.path,
                preserveProccess: this.preserveProccess,
                log: this.log
            });
            processedElements.push(e);
        });
        
        if(!this.preserveProccess) this.removePlugins()
        resolve(processedElements);
    })

    private getPlugins = () =>{
        let plugins: any[] = [];
        this.elements.forEach(  (elem: IVideoElement) =>
            { 
                const config: any = getJSON( join('templates',elem.templateConfig.name,elem.templateConfig.name) + '.json'); 
                const elemPlugin: Plugin[] = config.plugins || [];
                if(elemPlugin) elemPlugin.forEach( plugin => plugins.push(plugin));
            }
        )
        return [...  new Set(plugins)]; // removes the same elements
    }

    private setupPlugins = async () => {
        const pluginsPath = getOrCreateDir(join( this.path, 'plugins'));;
        let pluginsSrc: string[] = pluginsUtilities.getSrc(this.getPlugins());
        await pluginsSrc.forEach( async plugin => {
            const origin = join('src','plugins', plugin);
            const destination = join(pluginsPath, plugin)
            await copyFile(origin, destination);
        })
    }

    private removePlugins = () => removeDir(join( this.path, 'plugins'));

    private setupAssets = () => {
        const resourcesPath = getOrCreateDir(join( this.path, 'assets'));;
    }

}