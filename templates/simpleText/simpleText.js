"use strict";
console.log("Hola");
var params = { /*PARAMS*/};
let title = params.title ? params.title : 'default';
let color1 = params.color1 ? params.color1 : 'rgb(0,0,0)';
let bg = params.bg ? params.bg : 'rgb(255,255,255)';
let t = document.getElementById("text");
if (t) t.innerText = title;
let b = document.getElementById("bg");
if (b) b.style.backgroundColor = bg;

console.log(title);
anime.timeline({
    loop: true,
    autoplay: true
}).add({
    targets: '.square',
    width: '50px',
    duration: 1000,
    easing: 'easeInOutQuart',
}).add({
    targets: t,
    opacity: '100%',
    duration: 1000,
    easing: 'easeInOutQuart'
}).add({
    targets: '.square',
    height: '50px',
    duration: 1000,
    easing: 'easeInOutQuart',
}).add({
    targets: '.square',
    borderRadius: '20%',
    backgroundColor: color1,
    duration: 1000,
    easing: 'easeInOutQuart',
}).add({
    targets: '.square',
    rotate: 90,
    duration: 1000,
    easing: 'easeInOutQuart',
}).add({
    targets: t,
    opacity: '0%',
    duration: 1000,
    easing: 'easeInOutQuart'
}).add({
    targets: '.square',
    width: '30px',
    height: '30px',
    backgroundColor: 'rgb(0,0,0)',
    duration:1000,
    easing: 'easeInOutCubic',
})
