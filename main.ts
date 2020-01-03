import { writeTemplate } from './src/Templates'

writeTemplate({
    name: 'simpleText', 
    params: {'title': 'New Year', 'subtitle': 'new life'},
})
.then( (res) => { console.log(res); })
.catch( (err) => {console.log(err)} );
