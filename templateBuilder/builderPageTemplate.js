
console.log(params);
console.log("Builder Page Working..");
params.screenSize = {
    width: 1200,
    height: 720
}

function changeSize( width, height){
    if(String(width).indexOf("px") != -1) width = width.slice(0, params.width.indexOf("px"))
    if(String(height).indexOf("px") != -1) height = height.slice(0, params.height.indexOf("px"))

    main.style.width = width + 'px'
    main.style.height = height + 'px'
    
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

const renderer = document.querySelector("renderer");
const changeScale = (scale) => renderer.style.transform = `scale(${scale})`;

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
    changeScale(0.3);
}, 0);