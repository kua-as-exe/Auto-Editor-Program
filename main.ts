import { readFileSync, writeFileSync, existsSync} from 'fs';

interface Template {
    name: string,
    plugins?: string[],
    html? : string,
    css?: string,
    javascript?: string,
    processed?: true,
    params?: Object
}
interface Plugin {
    name: string,
    tag: string
}

const pluginList: Plugin[] = [
    { name: 'bootstrap', tag: `<link rel="stylesheet" href="../node_modules/bootstrap/dist/css/bootstrap.min.css">` },
    { name: 'anime.js', tag: `<script src="../node_modules/animejs/lib/anime.min.js"></script>` }
]

let fileNumber = 0;

function writeTemplate(template: Template){
    const path = `templates/${template.name}/${template.name}`;
    const getFile = (path: string):string => existsSync(path)? readFileSync(path, 'utf8'): '';
    const getCSS = ():string => template.css? template.css : getFile(`${path}.css`);
    const getHTML = ():string => template.html? template.html : getFile(`${path}.html`);
    const getJAVASCRIPT = ():string => template.javascript? template.javascript : getFile(`${path}.js`);
    const existPlugin = (plugin: Plugin): boolean | undefined => template.plugins && template.plugins.includes(plugin.name)
    const getPlugins = ():string => 
            template.plugins? 
            pluginList
                .filter( plugin => existPlugin(plugin) )
                .map( plugin => plugin.tag )
                .join('\n')
            : '';

    return new Promise( (resolve, reject) => {
        if(existsSync(`templates/${template.name}`)) {
            let mainTemplate = getFile(`templates/mainTemplate.html`);
            mainTemplate = mainTemplate.replace(`<!--PLUGINS-->`, getPlugins());
            mainTemplate = mainTemplate.replace(`/*STYLES*/`, getCSS());
            mainTemplate = mainTemplate.replace(`<!--HTML-->`, getHTML());
            mainTemplate = mainTemplate.replace(`/*SCRIPTS*/`, getJAVASCRIPT());
            if(template.params) mainTemplate = mainTemplate.replace(`{ /*PARAMS*/}`, JSON.stringify(template.params));

            writeFileSync(`recorder/${fileNumber}.html`, mainTemplate);
            fileNumber++;
            template.processed = true;
            resolve(template);
        }else reject('template not found: ' + template.name)
    })
}

writeTemplate({
    name: 'simpleText', 
    params: {'title': 'New day'},
    plugins: ['bootstrap', 'anime.js']
}).then((res)=>{
    console.log(res);
}).catch((err)=>{console.log(err)});
writeTemplate({
    name: 'simpleText', 
    params: {'title': 'Éxito éxito éxito', 'color1': 'rgb(255,255,0)'},
    plugins: ['anime.js']
}).then((res)=>{
    console.log(res);
}).catch((err)=>{console.log(err)});