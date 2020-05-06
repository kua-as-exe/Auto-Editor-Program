import express, { Application, Request, Response } from 'express';
import { join } from 'path';
import multer from 'multer';
import { renameSync } from 'fs-extra';
import {promisify} from 'util';
import { startEdition } from './edition2';

const app: Application = express();
const publicPath = "./public/";
const port = 5000;

const processorPath = './processors/processor_1';
const upload = multer({
    dest: './processors/processor_1' // this saves your file into a directory called "uploads"
}); 

console.log("Server server serverS")

function storeWithOriginalName (file: any) {
    var filename = file.originalname.toLowerCase().replace(/\s+/g, '_');
    var fullNewPath = join(file.destination, filename);
    renameSync(file.path, fullNewPath);
    return { fileName: filename }
}

app.post('/arreola/uploadFile', [upload.single('file-to-upload')], (req: Request, res:Response) => {
    //console.log(req);
    var {fileName} = storeWithOriginalName(req.file)
    console.log("Recibiendo: ", fileName);
    setTimeout( () => {
    startEdition(processorPath, fileName).then( (r) => {
            console.log("Todo chido, todo gud");
        }).catch( (e)=> {
            console.log("Algo anda mal bro");
        })
    }, 2500);
});

app.route('/arreola').get( (req: Request,res: Response) => {
    res.sendFile(join(__dirname,publicPath,'users', 'arreola.html'))
});

app.get('/', (req: Request, res:Response) => {
    res.sendFile(join(__dirname, publicPath, 'index.html'))
});

app.listen(port, ()=>console.log('Server running'));