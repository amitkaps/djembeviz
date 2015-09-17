// Visualise the time domain using a waveform

var mic
var song;
var analyzer;

// Array of amplitude values (-1 to +1) over time.
var samples = [];
var currentSource = "mic";

/*
function preload() {
  song = loadSound('../../song/djembesolo.mp3');
}
*/

function setup() {
  // Create a black canvas for the entire window
  createCanvas(windowWidth, windowHeight);
  background(17,17,17);
  noFill();
  stroke('#E7AD52');

  // Start the microphone and use for input
  mic = new p5.AudioIn();
  mic.start();

  // Start the FFT analyzer for the song
  analyzer = new p5.FFT();
  analyzer.setInput(mic);
}

function draw() {

  // Repaint the canvas as black
  background('#111111');
  noFill();
  stroke('#E7AD52');
  // text('press t to toggle source', 20, height - 60);

  // get a buffer of 1024 samples over time.
  samples = analyzer.waveform();
  var bufLen = samples.length;

  // draw snapshot of the samples
  strokeWeight(3);
  beginShape();
  for (var i = 0; i < bufLen; i++){
    var x = map(i, 0, bufLen, 0, width);
    var y = map(samples[i], -1, 1, -height*7/8/2, height*7/8/2);
    vertex(x, y + height/2);
  }
  endShape();

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
