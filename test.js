const timecut = require('timecut');
timecut({
  //url: 'https://tungs.github.io/truchet-tiles-original/#autoplay=true&switchStyle=random',
  url: './test.html',
  //url: 'https://animejs.com/',
  viewport: {
    width: 600,
    height: 600
  },
  fps: 25,
  duration: 10,
  transparentBackground: true,
  //keepFrames: true,
  output: 'videoHtml20.mp4',
  outputOptions: ['-vcodec', 'ffvhuff'],
  pixFmt: ''
}).then(function () {
  console.log('Done!');
});