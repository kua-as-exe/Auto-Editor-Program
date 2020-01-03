"use strict";
var params = { /*PARAMS*/};

console.log(params);

var typed6 = new Typed('#text', {
    strings: ['^1000','Prueba exitosa^2000', 'Comenzando autodestrucción^1000', '3^1000', '2^1000', '1^1000', 'Ah te la creiste we xd^1000','^1000'],
    typeSpeed: 40, backSpeed: 50, loop: true
});

anime.timeline({
    loop: true,
    autoplay: true,
}).add({
    targets: '.square',
    scale: 1,
    easing: 'easeInOutQuart',
    delay: (f,d)=> d*120,
    duration: 250
}).add({
    targets: '.square',
    scale: 1.2,
    easing: 'easeInOutQuart',
    delay: (f,d)=> d*120,
    duration: 500
})
.add({
    targets: '.square',
    scale: 1,
    easing: 'easeInOutQuart',
    delay: (f,d)=> d*120,
    duration: 250
})
