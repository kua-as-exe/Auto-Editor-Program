"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const multer_1 = __importDefault(require("multer"));
const fs_extra_1 = require("fs-extra");
const edition_1 = require("./edition");
const Utilities_1 = require("../../src/Utilities");
const app = express_1.default();
const publicPath = "./public/";
const port = 5000;
const processorPath = './processors/processor_1';
const upload = multer_1.default({
    dest: Utilities_1.PathJoin(processorPath, 'videos')
});
console.log("Server server serverS");
const storeWithOriginalName = (file) => __awaiter(void 0, void 0, void 0, function* () {
    var filename = file.originalname.toLowerCase().replace(/\s+/g, '_');
    var fullNewPath = path_1.join(file.destination, filename);
    fs_extra_1.renameSync(file.path, fullNewPath);
    return { fileName: filename };
});
app.post('/arreola/uploadFile', [upload.single('file-to-upload')], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var { fileName } = yield storeWithOriginalName(req.file);
    console.log("Recibiendo: ", fileName);
    edition_1.startEdition(processorPath, fileName).then((r) => {
        console.log("Todo chido, todo gud");
    }).catch((e) => {
        console.log("Algo anda mal bro");
    });
}));
app.route('/arreola').get((req, res) => {
    res.sendFile(path_1.join(__dirname, publicPath, 'users', 'arreola.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path_1.join(__dirname, publicPath, 'index.html'));
});
app.listen(port, () => console.log('Server running'));
