import {IPlugin} from './interfaces';

export const PluginList: IPlugin[] = [
    { 
        name: 'bootstrap',
        tag: `<link rel="stylesheet" href="../plugins/bootstrap/bootstrap.min.css">`,
        src: 'bootstrap/bootstrap.min.css',
    },
    { 
        name: 'anime.js',
        tag: `<script src="../plugins/anime.js/anime.min.js"></script>`,
        src: 'anime.js/anime.min.js',
    },
    { 
        name: 'typed.js',
        tag: `<script src="../plugins/typed.js/typed.min.js"></script>`,
        src: 'typed.js/typed.min.js'
    },
]