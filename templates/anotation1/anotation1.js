document.getElementById('text').innerText = params.text || 'Jorge Arreola'
document.getElementById('subtext').innerText = params.subtext || 'Subtexto'

let duration = params.duration * 1000 || 8000

anime.timeline({
    loop: false, autoplay: true,
}).add({
    targets: "#back",
    width: ['0%', '100%'],
    opacity: ['0%', '100%'],
    easing: 'easeInOutQuart',
    duration: 1000,
}).add({
    targets: "#text",
    height: ['0%', '100%'],
    width: ['0%', '100%'],
    opacity: ['0%', '100%'],
    easing: 'easeInOutQuart',
    duration: 1000,
    delay: 500
}).add({
    targets: "#back2",
    width: ['0%', '80%'],
    opacity: ['0%', '100%'],
    easing: 'easeInOutQuart',
    duration: 1000
}).add({
    targets: "#subtext",
    width: ['0%', '100%'],
    opacity: ['0%', '100%'],
    easing: 'easeInOutQuart',
    duration: 1000
}).add({
    targets: "#back2",
    height: ['50%', '0%'],
    opacity: ['100%', '0%'],
    easing: 'easeInOutQuart',
    duration: 1000,
    delay: duration-6550
}).add({
    targets: "#back",
    width: ['100%', '0%'],
    opacity: ['100%', '0%'],
    easing: 'easeInOutQuart',
    duration: 1000,
    delay: 50
})