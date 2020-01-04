"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Templates_1 = require("./src/Templates");
Templates_1.writeTemplate({
    name: 'simpleText',
    params: {
        'text': 'Vamos bien, vamos bien'
    }
})
    .then((res) => { console.log(res); })
    .catch((err) => { console.log(err); });
