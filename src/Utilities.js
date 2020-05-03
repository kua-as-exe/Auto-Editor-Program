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
Object.defineProperty(exports, "__esModule", { value: true });
const Declarations_1 = require("./Declarations");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const chalk_1 = require("chalk");
exports.Color = {
    red: chalk_1.red,
    cyan: chalk_1.cyan,
    green: chalk_1.green,
    yellow: chalk_1.yellow
};
exports.copyFile = fs_extra_1.copy;
exports.removeDir = fs_extra_1.remove;
exports.exists = fs_extra_1.existsSync;
exports.writeFile = fs_extra_1.writeFileSync;
const removeBackslash = (arg) => arg.replace(/\\/g, "/");
exports.PathJoin = (...paths) => removeBackslash(path_1.join.apply(null, paths));
exports.PathResolve = (...paths) => removeBackslash(path_1.resolve.apply(null, paths));
exports.PathParse = (path) => path_1.parse(path);
exports.mergeJSON = (...jsons) => Object.assign(jsons);
exports.isUndefined = (value) => value === undefined;
exports.getOrCreateDir = (dir) => {
    if (dir && !fs_extra_1.existsSync(dir))
        fs_extra_1.mkdirSync(dir, { recursive: true });
    return dir;
};
function asyncForEach(array, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let index = 0; index < array.length; index++) {
            yield callback(array[index], index, array);
        }
    });
}
exports.asyncForEach = asyncForEach;
exports.getFile = (path) => {
    if (fs_extra_1.existsSync(path))
        return fs_extra_1.readFileSync(path, 'utf8');
    else
        return '';
};
exports.getJSON = (path) => {
    if (fs_extra_1.existsSync(path))
        return JSON.parse(fs_extra_1.readFileSync(path, 'utf8'));
    else
        return {};
};
const existPlugin = (pluginLists, plugin) => pluginLists && pluginLists.includes(plugin.name);
const getPlugins = (pluginLists) => Declarations_1.PluginList.filter(plugin => existPlugin(pluginLists, plugin));
const getPluginsTags = (pluginLists) => getPlugins(pluginLists).map(plugin => plugin.tag).join('\n');
const getPluginsSrc = (pluginLists) => getPlugins(pluginLists).map(plugin => plugin.src || "");
exports.pluginsUtilities = {
    //exists: existPlugin,
    //getPlugins: getPlugins,
    getTags: getPluginsTags,
    getSrc: getPluginsSrc
};
