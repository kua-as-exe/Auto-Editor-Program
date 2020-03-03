import { processElement } from "./VideoElement";
import { VideoElement } from "./Interfaces";

async function asyncForEach(array: any[], callback: Function) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

export class ElementProcessor {
    id:number;
    path: string;
    elements: VideoElement[] = [];
    constructor(id: number, config?: any){
        this.id = id;
        this.path = (config && config.path) || `processor_${id}`;
    }

    add = (videoElement: VideoElement) => {
        videoElement.id = this.elements.length;
        this.elements.push(videoElement);
    }

    processElements = () => new Promise<VideoElement[]>( async (resolve, reject) => {
        let processedElements: VideoElement[] = [];
        await asyncForEach(this.elements, async (videoElement: VideoElement)=>{
            processedElements.push(await processElement(videoElement));
        });
        resolve(processedElements);
    })

}