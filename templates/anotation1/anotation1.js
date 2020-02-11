document.getElementById('text').innerText = params.text || 'Texto'
document.getElementById('subtext').innerText = params.subtext || 'Subtexto'

anime.timeline({
    loop: false, autoplay: true,
}).add({
    targets: "#back",
    height: ['0%', '100%'],
    opacity: ['0%', '100%'],
    easing: 'easeInOutQuart',
    duration: 1500
}).add({
    targets: "#text",
    width: ['0%', '100%'],
    opacity: ['0%', '100%'],
    easing: 'easeInOutQuart',
    duration: 1500
}).add({
    targets: "#subtext",
    width: ['0%', '100%'],
    opacity: ['0%', '100%'],
    easing: 'easeInOutQuart',
    duration: 1500
})