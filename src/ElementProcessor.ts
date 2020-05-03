import { IVideoElement, IElementConfig, IElementProcessorState } from "./Interfaces";
import { processElement } from "./VideoElement";
import { 
    getOrCreateDir, 
    asyncForEach, 
    getJSON, 
    pluginsUtilities, 
    copyFile, 
    removeDir, 
    PathJoin 
} from "./Utilities";

export class ElementProcessor {
    private id:number;
    private mainPath: string = "processors";
    private customPath: string;
    private path: string;
    private elements: IVideoElement[] = [];
    private preserveProccess: boolean = false;
    private log: boolean = false;
    private state: IElementProcessorState;

    constructor(id: number, config?: IElementConfig){
        this.id = id;
        this.customPath = `processor_${id}`;
        if(config){
            this.customPath = config.customDir || this.customPath;
            this.preserveProccess = config.preserveProccess || false;
            this.log = config.log || false;
        }
        this.path = PathJoin(this.mainPath, this.customPath);
        this.state = {
            setup: {
                plugins: false,
                resources: false
            }
        };
    }

    add = (videoElement: IVideoElement) => {
        videoElement.id = this.elements.length;
        this.elements.push(videoElement);
    }

    processElements = () => new Promise<IVideoElement[]>( async (resolve, reject) => {
        let processedElements: IVideoElement[] = [];

        if(!this.state.setup.plugins) await this.setupPlugins();
        await this.setupAssets();
        
        await asyncForEach(this.elements, async (videoElement: IVideoElement)=>{
            var elem = await processElement(videoElement, {
                customDir: this.path,
                preserveProccess: this.preserveProccess,
                log: this.log
            });
            processedElements.push(elem);
        });
        
        if(!this.preserveProccess) this.removePlugins()
        resolve(processedElements);
    })

    private getPlugins = () => {
        let plugins: any[] = [];
        this.elements.forEach(  (elem: IVideoElement) =>
            { 
                const config: any = getJSON( PathJoin('templates',elem.templateConfig.name,elem.templateConfig.name) + '.json'); 
                const elemPlugin: Plugin[] = config.plugins || [];
                if(elemPlugin) elemPlugin.forEach( plugin => plugins.push(plugin));
            }
        )
        return [...  new Set(plugins)]; // removes the same elements
    }

    setupPlugins = async () => {
        const pluginsPath = getOrCreateDir(PathJoin( this.path, 'plugins'));;
        let pluginsSrc: string[] = pluginsUtilities.getSrc(this.getPlugins());
        await pluginsSrc.forEach( async plugin => {
            const origin = PathJoin('src','plugins', plugin);
            const destination = PathJoin(pluginsPath, plugin)
            await copyFile(origin, destination);
        })
        this.state.setup.plugins = true;
    }

    removePlugins = () => {
        removeDir(PathJoin( this.path, 'plugins'));
        this.state.setup.plugins = false;
    };

    private setupAssets = () => {
        const resourcesPath = getOrCreateDir(PathJoin( this.path, 'assets'));;
    }

}