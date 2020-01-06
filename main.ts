import { recordTemplate } from './src/TemplateRecorder';
import { writeTemplate } from './src/Templates';
import { Template, RecordConfig, VideoElement } from './src/Interfaces';
import { basename, join } from 'path';
import { isUndefined } from 'util';


const processElement = (_element: VideoElement, _dir?: string)=> {

    return new Promise ( async (resolve, reject ) => {
        if(isUndefined(_element)) reject("Element its undefined: "+ JSON.stringify(_element))
        let dir = _dir || './recorder';
        let element: VideoElement = _element;
        let htmlFile: Template = await writeTemplate(element.templateConfig);
        let filename = basename(htmlFile.fileName || '', '.html');

        element.recordConfig = {
            inputUrl: htmlFile.outputUrl || "",
            outNameFile: join(dir, filename),
            duration: htmlFile.params.duration || 3,
            width: htmlFile.params.width,
            height: htmlFile.params.height,
            transparent: true,
        }

        element.videoOutput = await recordTemplate(element.recordConfig)
        resolve(element)
    })
}

const main = async () => {

    processElement({
        templateConfig: {
            name: 'simpleText', 
            params: {
                'text': 'Vamos bien, vamos bien',
                'duration': 1
            }
        }
    }).then( (result) => {
        console.log(result)
    })
    
}

main();