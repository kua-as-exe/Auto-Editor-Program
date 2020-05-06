"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const multer_1 = __importDefault(require("multer"));
const fs_extra_1 = require("fs-extra");
const edition2_1 = require("./edition2");
const app = express_1.default();
const publicPath = "./public/";
const port = 5000;
const processorPath = './processors/processor_1';
const upload = multer_1.default({
    dest: './processors/processor_1' // this saves your file into a directory called "uploads"
});
console.log("Server server serverS");
function storeWithOriginalName(file) {
    var filename = file.originalname.toLowerCase().replace(/\s+/g, '_');
    var fullNewPath = path_1.join(file.destination, filename);
    fs_extra_1.renameSync(file.path, fullNewPath);
    return { fileName: filename };
}
app.post('/arreola/uploadFile', [upload.single('file-to-upload')], (req, res) => {
    //console.log(req);
    var { fileName } = storeWithOriginalName(req.file);
    console.log("Recibiendo: ", fileName);
    setTimeout(() => {
        edition2_1.startEdition(processorPath, fileName).then((r) => {
            console.log("Todo chido, todo gud");
        }).catch((e) => {
            console.log("Algo anda mal bro");
        });
    }, 2500);
});
app.route('/arreola').get((req, res) => {
    res.sendFile(path_1.join(__dirname, publicPath, 'users', 'arreola.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path_1.join(__dirname, publicPath, 'index.html'));
});
app.listen(port, () => console.log('Server running'));
