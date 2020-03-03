import { processElement } from "./VideoElement";
import { VideoElement, ElementConfig } from "./Interfaces";
import { join } from "path";

async function asyncForEach(array: any[], callback: Function) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

export class ElementProcessor {
    id:number;
    mainPath: string = "processors";
    customPath: string;
    elements: VideoElement[] = [];
    preserveProccess: boolean = false;
    log: boolean = false;
    constructor(id: number, config?: ElementConfig){
        this.id = id;
        this.customPath = `processor_${id}`;
        if(config){
            this.customPath = config.customDir || this.customPath;
            this.preserveProccess = config.preserveProccess || false;
            this.log = config.log || false;
        }
    }

    add = (videoElement: VideoElement) => {
        videoElement.id = this.elements.length;
        this.elements.push(videoElement);
    }

    processElements = () => new Promise<VideoElement[]>( async (resolve, reject) => {
        let processedElements: VideoElement[] = [];
        await asyncForEach(this.elements, async (videoElement: VideoElement)=>{
            var e = await processElement(videoElement, {
                customDir: join(this.mainPath, this.customPath),
                preserveProccess: this.preserveProccess,
                log: this.log
            });
            processedElements.push(e);
        });
        resolve(processedElements);
    })

}