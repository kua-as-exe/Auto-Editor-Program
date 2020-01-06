import { recordTemplate } from './src/TemplateRecorder';
import { writeTemplate } from './src/Templates';
import { Template, RecordConfig } from './src/Interfaces';
import { basename, join } from 'path';

const main = async () => {
    
    const templateConfig: Template = {
        name: 'simpleText', 
        params: {
            'text': 'Vamos bien, vamos bien',
            'duration': 15
        }
    }

    let file: Template = await writeTemplate(templateConfig)
    let dir = './recorder';
    let filename = basename(file.fileName || '', '.html');

    const videoConfig: RecordConfig = {
        inputUrl: file.outputUrl || "",
        outNameFile: join(dir, filename),
        duration: file.params.duration || 3,
        width: file.params.width,
        height: file.params.height,
        transparent: true,
    }
    let videoOutput = await recordTemplate(videoConfig)
    console.log(videoOutput);

}

main();