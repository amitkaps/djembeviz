// Visualise the frequency domain using FFT

var mic
var song;
var analyzer;

// Array of amplitude values (-1 to +1) over Frequency.
var samples = [];
var currentSource = "mic";


function preload() {
  song = loadSound('../../song/teach.mp3');
}


function setup() {
  // Create a black canvas for the entire window
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1)
  background(0,0,0);

  // Start the microphone and use for input
  mic = new p5.AudioIn();
  mic.start();

  // Start the FFT analyzer for the song, default 1024 bin
  analyzer = new p5.FFT(0.8, 256);
  analyzer.setInput(mic);
}

function draw() {
  // Repaint the canvas as black
  background(0,0,0);
  noStroke();
  // text('press t to toggle source', 20, height - 60);

  // get a buffer of 1024 samples over Frequency.
  samples = analyzer.analyze();
  var bins = samples.length;
  binwidth = width / bins

  // draw snapshot of the samples
  for (var i = 0; i < bins; i++){
    var x = map(i, 0, bins, 0, width);
    var l = map(samples[i], 0, 255, 0, height);
    var y = height - l;
    var c = color(round(map(i, 0, bins, 0, 360)), 100, 100);
    fill(c);
    rect(x, y, binwidth, l);
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
