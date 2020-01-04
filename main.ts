import { writeTemplate } from './src/Templates'

writeTemplate({
    name: 'simpleText', 
})
.then( (res) => { console.log(res); })
.catch( (err) => {console.log(err)} );
