"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Templates_1 = require("./src/Templates");
Templates_1.writeTemplate({
    name: 'simpleText',
    params: { 'title': 'New Year', 'bg': 'rgb(100,255,200)' },
})
    .then((res) => { console.log(res); })
    .catch((err) => { console.log(err); });
Templates_1.writeTemplate({
    name: 'simpleText',
    plugins: ['bootstrap'],
    params: {
        'title': 'Working, working.. work?',
        'color1': 'rgb(0,120,0)',
        'bg': 'rgb(110,200,250)'
    },
})
    .then((res) => { console.log(res); })
    .catch((err) => { console.log(err); });
