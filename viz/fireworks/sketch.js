// Visualise using an ellipse moving randomly

var mic;
var song;
var amplitude;
var analyzer;
// for red, green, and blue color values
var r, g, b;

function preload() {
  song = loadSound('../../song/djembesolo.mp3');
}

function setup() {
  // Create a black canvas for the entire window
  createCanvas(windowWidth, windowHeight);
  background(17,17,17,0.8);
  fill('#f3d7ac');
  noStroke();

  // Start the microphone and use for input
  mic = new p5.AudioIn();
  mic.start();

  // Get the amplitude (volume) of the song
  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);

  // Start the FFT analyzer for the song
  analyzer = new p5.FFT();
  analyzer.setInput(mic);
}

function draw() {

    // Repaint the canvas as black
    background(17,17,17,50);

    r = random(255);
    g = random(255);
    b = random(255);
    fill(r,g,b,127);
    noStroke();
    // text('press t to toggle source', 20, height - 60);

    // Get the level of the Amplitude
    var level = amplitude.getLevel();

    var x = random(width);
    var y = random(height);

    // map ellipse size to the amplitude
    var size = map(level, 0, 1, 0, 1200);
    ellipse(x, y, size, size);


}
