
setTimeout(()=>{
    console.log(params.screenSize)
    if(onDev) changeSize(params.screenSize.width, params.screenSize.height)
    //main.style.width = params.screenSize.width;
    //main.style.height = params.screenSize.height;
},500)
/*document.getElementById('title').innerText = params.title || 'Título'
document.getElementById('subtitle').innerText = params.subtitle || 'Subtítulo'*/

duration = params.duration*1000 || 8000
anime()
anime.timeline({

}).add({
    targets: 'img',
    opacity: [0,1],
    easing: 'easeInOutQuart',
    duration: 1000,
    delay: 0
}).add({
    targets: 'img',
    opacity: [1,0],
    easing: 'easeInOutQuart',
    duration: 1000,
    delay: duration-2000
})
