//document.getElementById('title').innerText = params.title || 'Título'
//document.getElementById('subtitle').innerText = params.subtitle || 'Subtítulo'

var typed6 = new Typed('#title', {
    strings: ['^1000', params.title || 'Título'],
    typeSpeed: 40, backSpeed: 50
});
setTimeout( ()=>{
    var typed7 = new Typed('#subtitle', {
        strings: ['es realmente sorprendente^1000', params.subtitle || 'Subtítulo'],
        typeSpeed: 40, backSpeed: 50
    });
}, 5000);

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
