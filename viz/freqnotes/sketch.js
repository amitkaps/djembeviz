// Visualise the frequency log domain using FFT

var mic
var song;
var analyzer;

// Array of amplitude values (-1 to +1) over Frequency.
var samples = [];
var currentSource = "mic";

// Create Bass Band and Slider variable
var bassBand = 10;
var bassSlider;
var maxBand;
var maxValue;
var bass;

function preload() {
  song = loadSound('../../song/teach.mp3');
}


function setup() {
  // Create a black canvas for the entire window
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1)
  background(0,0,0);

  // create sliders
  bassSlider = createSlider(0, 100, bassBand);
  bassSlider.position(width*6/8, height*1/8);

  // Start the microphone and use for input
  mic = new p5.AudioIn();
  mic.start();

  // Start the FFT analyzer for the song, default 1024 bin
  analyzer = new p5.FFT(0.8, 1024);
  analyzer.setInput(mic);
}

function draw() {
  // Repaint the canvas as black
  background(0,0,0);
  fill(37,61,90);
  noStroke();
  // text('press t to toggle source', 20, height - 60);

  // Set the Slidervalues
  bassBand = bassSlider.value();

  // get a buffer of 1024 samples over Frequency.
  samples = analyzer.analyze();
  var bins = samples.length;
  binwidth = width / bins

  // Find out the max band
  maxBand = -1;
  maxValue = 0;
  for (var i = 0; i < bins; i++){
    if (samples[i] > maxValue) {
      maxValue = samples[i];
      maxBand = i;
    }
  }

  if (maxBand <= bassBand) {
    bass = 1;
  } else {
    bass = 0;
  }

  // Paint the background rect
  var wide = map(Math.log2(bassBand+2), 0, Math.log2(bins+2), 0, width);
  fill(60,100,50);
  rect(0,0,wide,height);
  fill(4,19,20);
  rect(wide,0,width - wide,height);
  fill(37,61,90);

  // Create Slider Text
  fill(200)
  text('Bass Band Select: ' + bassBand, width*6/8, height*1/8 - 10);

  // draw snapshot of the samples on a log scale
  var xcum = 0;
  for (var i = 0; i < bins; i++){
    var x = map(Math.log2(i+2), 0, Math.log2(bins+2), 0, width);
    var l = map(samples[i], 0, 255, 0, height);
    var y = height - l;
    // var c = color(round(map(i, 0, bins, 0, 360)), 100, 100);
    // fill(c);
    fill(37, 61, 90, 0.5);
    if (bass === 1) {
      if (i <= bassBand) {
        fill(200);
      }
    } else {
      if (i > bassBand){
        fill(200);
      }
    }
    rect(xcum, y, x - xcum, l);
    xcum = x;
  }

}

// resize canvas on windowResized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// toggle input
function keyPressed() {
  if (key == 'T') {
    toggleInput();
  }
}

function toggleInput() {
  if (song.isPlaying() ) {
    song.pause();
    mic.start();
    analyzer.setInput(mic);
  } else {
    song.play();
    mic.stop();
    analyzer.setInput(song);
  }
}
