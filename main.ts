import { writeTemplate } from './src/Templates'

writeTemplate({
    name: 'simpleText', 
    params: {'title': 'New Year', 'bg': 'rgb(100,255,200)'},
})
.then( (res) => { console.log(res); })
.catch( (err) => {console.log(err)} );

writeTemplate({
    name: 'simpleText', 
    plugins: ['bootstrap'],
    params: {
        'title': 'Working, working.. work?', 
        'color1': 'rgb(0,120,0)',
        'bg': 'rgb(110,200,250)'},
})
.then( (res)=>{console.log(res);})
.catch((err)=>{console.log(err)});
