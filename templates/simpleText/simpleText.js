"use strict";
var params = { /*PARAMS*/};
const main = document.getElementsByTagName('main')[0];
if(params.width) main.style.width = params.width;
if(params.height) main.style.height = params.height;
console.log(params);

//if(params.text && document.getElementById('texto')) document.getElementById('texto').innerText = params.text

var typed6 = new Typed('#text', {
    strings: ['^1000','Buenas noches...^2000', 'Descansen^1000', 'que cuando el mundo se acabe ya no podrán^1000'],
    typeSpeed: 40, backSpeed: 50
});
setTimeout( ()=>{
    var typed7 = new Typed('#texto', {
        strings: ['atte. Donald Trump'],
        typeSpeed: 40, backSpeed: 50
    });
}, 14000);

anime({
    targets: '#bg',
    width: [0, 450],
    easing: 'easeInOutQuart',
    duration: 2000
})

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
