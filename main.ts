import { writeTemplate } from './src/Templates'

writeTemplate({
    name: 'simpleText', 
    params: {
        'text': 'Vamos bien, vamos bien'
    }
})
.then( (res) => { console.log(res); })
.catch( (err) => {console.log(err)} );
