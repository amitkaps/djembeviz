// Preload a Song and get its amplitude
// Visualise using an ellipse jumping

var song;
var amplitude;
var mapMax = 4;

function preload() {
  song = loadSound('../../song/djembesolo.mp3');
}

function setup() {
  // Create a black canvas for the entire window
  createCanvas(windowWidth, windowHeight);
  background(0);
  fill(255);
  noStroke();

  // Song is ready to play during setup() because it was preloaded
  // Play the song on a loop
  song.loop();

  // Get the amplitude (volume) of the song
  amplitude = new p5.Amplitude();
  amplitude.setInput(song);
}

function draw() {

    // Repaint the canvas as black
    background(0);

    // Get the level of the Amplitude
    var level = amplitude.getLevel();
    text('Amplitude: ' + level, 20, 20);
    text('mapMax: ' + mapMax, 20, 40);

    // map ellipse height to the amplitude
    var ellipseHeight = logMap(level, 0, mapMax, height, 0);
    ellipse(width/2, ellipseHeight, 100, 100);
}
