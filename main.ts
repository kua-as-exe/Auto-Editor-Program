import { recordTemplate } from './src/TemplateRecorder';
import { writeTemplate } from './src/Templates';
import { Template, RecordConfig, VideoElement } from './src/Interfaces';
import { basename, join } from 'path';

const main = async () => {
    
    const element: VideoElement = {
        templateConfig: {
            name: 'simpleText', 
            params: {
                'text': 'Vamos bien, vamos bien',
                'duration': 1
            }
        }
    }

    let file: Template = await writeTemplate(element.templateConfig);
    let dir = './recorder';
    let filename = basename(file.fileName || '', '.html');

    element.recordConfig = {
        inputUrl: file.outputUrl || "",
        outNameFile: join(dir, filename),
        duration: file.params.duration || 3,
        width: file.params.width,
        height: file.params.height,
        transparent: true,
    }

    let videoOutput = await recordTemplate(element.recordConfig)
    element.videoOutput = videoOutput;
    console.log(element)
}

main();