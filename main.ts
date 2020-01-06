import { recordTemplate } from './src/TemplateRecorder';
import { writeTemplate } from './src/Templates';
import { Template } from './src/Interfaces';
import { basename, join } from 'path';


writeTemplate({
    name: 'simpleText', 
    params: {
        'text': 'Vamos bien, vamos bien',
        'duration': 15
    }
})
.then( (file: Template) => {
    let dir = './recorder';
    let filename = basename(file.fileName || '', '.html');

    recordTemplate({
        inputUrl: file.outputUrl || "",
        outNameFile: join(dir, filename),
        duration: file.params.duration || 3,
        width: file.params.width,
        height: file.params.height,
        transparent: true,
    })
})
.catch( (err) => {console.log(err)} );