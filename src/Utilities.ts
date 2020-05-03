import { PluginList } from "./Declarations";
import { IPlugin } from "./Interfaces";

import { copy, mkdirSync, existsSync, readFileSync, remove, writeFileSync } from "fs-extra";
import { join, resolve, parse } from 'path';
import { red, cyan, green, yellow } from 'chalk';

export const Color = {
    red: red,     
    cyan: cyan,
    green: green,
    yellow: yellow     
}

export const copyFile = copy;
export const removeDir = remove;
export const exists = existsSync;
export const writeFile = writeFileSync;

const removeBackslash = (arg: string) => arg.replace(/\\/g, "/");
export const PathJoin = (...paths: string[]) => removeBackslash(join.apply(null, paths));
export const PathResolve = (...paths: string[]) => removeBackslash(resolve.apply(null, paths));
export const PathParse = (path: string) => parse(path);

export const mergeJSON = (...jsons: Object[]) => Object.assign(jsons);
export const isUndefined = (value:any) => value === undefined;

export const getOrCreateDir = ( dir: string) => {
    if (dir && !existsSync(dir)) mkdirSync(dir, { recursive: true });
    return dir;
}

export async function asyncForEach(array: any[], callback: Function) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

export const getFile = (path: string):string => {
    if(existsSync(path)) return readFileSync(path, 'utf8');
    else return '';
};

export const getJSON = (path:string ):Object => {
    if(existsSync(path)) return JSON.parse(readFileSync(path, 'utf8'))
    else return {};
}

const existPlugin = (pluginLists: any[], plugin: any): boolean | undefined => pluginLists && pluginLists.includes(plugin.name)

const getPlugins = (pluginLists: IPlugin[] ): IPlugin[] => 
    PluginList.filter( plugin => existPlugin(pluginLists, plugin) );

const getPluginsTags = ( pluginLists: any[] ): string => 
    getPlugins(pluginLists).map( plugin => plugin.tag ).join('\n')

const getPluginsSrc =  ( pluginLists: any[] ): string[] => 
    getPlugins(pluginLists).map( plugin => plugin.src || "" )

export const pluginsUtilities = {
    //exists: existPlugin,
    //getPlugins: getPlugins,
    getTags: getPluginsTags,
    getSrc: getPluginsSrc
}