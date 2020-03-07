import { copy, mkdirSync, existsSync, readFileSync, remove } from "fs-extra";
import { PluginList } from "./Declarations";
import { IPlugin } from "./Interfaces";

import { red, cyan, green, yellow} from 'chalk';
export const Color = {
    red: red,     
    cyan: cyan,
    green: green,
    yellow: yellow     
}

export const copyFile = copy;
export const removeDir = remove;

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