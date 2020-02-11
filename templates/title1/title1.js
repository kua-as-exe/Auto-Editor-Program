document.getElementById('title').innerText = params.title || 'Título'
document.getElementById('subtitle').innerText = params.subtitle || 'Subtítulo'
anime()
anime.timeline({

}).add({
    targets: '#bg',
    height: ['0%', '100%'],
    opacity: [50,100],
    easing: 'easeInOutQuart',
    duration: 2000
})