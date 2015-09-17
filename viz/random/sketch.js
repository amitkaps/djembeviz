// Visualise the amplitude of the music
// Plots an ellipse moving randomly on the middle line

var mic;
var song;
var amplitude;
// for red, green, and blue color values
var r, g, b;

/*
function preload() {
  song = loadSound('../../song/djembesolo.mp3');
}
*/

function setup() {
  // Create a black canvas for the entire window
  createCanvas(windowWidth, windowHeight);
  background(17,17,17);
  fill('#f3d7ac');
  noStroke();

  // Start the microphone and use for input
  mic = new p5.AudioIn();
  mic.start();

  // Get the amplitude (volume) of the song
  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);
}

function draw() {

    // To change the frame rate
    // frameRate(60)

    // Repaint the canvas as black
    background(17,17,17,50);

    r = random(255);
    g = random(255);
    b = random(255);
    fill(r,g,b,127);
    // For color variant - comment out the below
    // fill('#E7AD52');
    noStroke();
    // text('press t to toggle source', 20, height - 60);

    // Get the level of the Amplitude
    var level = amplitude.getLevel();

    var x = random(width);
    var y = random(height);

    // map ellipse size to the amplitude
    // plot it on middle line in the canvas
    var size = map(level, 0, 1, 0, 1200);
    ellipse(x, height/2, size, size);


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
    amplitude.setInput(mic);
  } else {
    song.play();
    mic.stop();
    amplitude.setInput(song);
  }
}
