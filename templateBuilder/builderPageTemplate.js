
var percent = (v, p) => v*p/100;


console.log(params);
console.log("Builder Page Working..");
params.screenSize = {
    width: 1200,
    height: 720
}

function removePx(m){
    const px = String(m).indexOf("px");
    if(px != -1) return Number(m.slice(0, px));
    return Number(m);
}

function changeSize( width, height){
    width = removePx(width);
    height = removePx(height);

    main.style.width = width + 'px';
    main.style.height = height + 'px';
    
    const x = document.getElementById("x"); 
    if(x){
        x.querySelector("span").innerHTML = width+'px';
        x.querySelector("span").style.opacity = 1;
        x.style.width = width+'px';
    }
    
    const y = document.getElementById("y"); 
    if(y){
        y.querySelector("span").innerHTML = height+'px';
        y.querySelector("span").style.opacity = 1;
        y.style.height = (height-6)+'px';
    }

}

function refreshPosition(){
    var y = (-params.screenSize.height + removePx(main.style.height))/2;
    var x = (-params.screenSize.width + removePx(main.style.width))/2;
    y += params.elementPosition.y || 0;
    x += params.elementPosition.x || 0;
    
    container = document.getElementsByTagName("container")[0]
    container.style.transform = `translate(${x}px, ${y}px)`;
}
refreshPosition()

function changePosition(width, height){
    params.elementPosition.x = width;
    params.elementPosition.y = height;
    refreshPosition();
}

const renderer = document.querySelector("renderer");

var rendererScale = 0
const changeScale = (scale) => {
    rendererScale = scale;
    renderer.style.transform = `scale(${scale})`;
}

const autoScale = () => {
    var visualizer = document.getElementsByTagName("visualizer")[0]
    var x = screenVisualizer.scrollWidth / visualizer.scrollHeight
    var y = params.screenSize.width / params.screenSize.height
    var c = 0.9;
    var s = (y/x)*c
    changeScale(s); 
}

const convertRange = ( value, r1, r2 ) => ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
const scaleRange = document.getElementById("scale-range");
scaleRange.addEventListener('input', function(){
    changeScale(convertRange(this.value, [this.max,this.min], [2, 0.3]).toFixed(3));
});


function sizeRandomizerTest(){
    var sizes = [
        {x: 50, y: 75},
        {x: 50, y: 50},
        {x: 100, y: 100},
        {x: 250, y: 75},
        {x: 75, y: 120},
        {x: 120, y: 60},
        {x: 300, y: 100},
    ];
    var i = 0;
    
    setInterval( ()=> {
       changeSize(sizes[i].x, sizes[i].y);
        i++
        if(i >= sizes.length) i = 0;
    }, 1000);
}

const templateTitle = document.getElementById("templateTitle");
const screenVisualizer = document.querySelector("screen");
if(templateTitle) templateTitle.innerText = params.templateName || '~ ~ ~'
if(screenVisualizer && params.screenSize) {
    console.log(params.screenSize);
    screenVisualizer.style.width = params.screenSize.width+'px';
    screenVisualizer.style.height = params.screenSize.height+'px';
}

setTimeout(()=>{
    changeSize(params.width, params.height);
    autoScale();
}, 0);