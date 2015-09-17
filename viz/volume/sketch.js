// Preload a Song and get its amplitude
// Visualise using an ellipse jumping

var mic;
var song;
var amplitude;
var mapMax = 0.8;

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

    // Repaint the canvas as black
    background(17,17,17);
    fill('#E7AD52');

    // text('press t to toggle source', 20, height - 60);

    // Get the level of the Amplitude
    var level = amplitude.getLevel();

    // var size = map(level, 0, 1, 0, 1200);
    // ellipse(width/2, height/2, size, size);

    // Draw the max and min lines
    strokeWeight(1);
    stroke('#E7AD52');
    line(width*2/8, height*7/8, width*6/8, height*7/8);
    line(width*2/8, height*1/8, width*6/8, height*1/8);

    noStroke();

    // map ellipse height to the amplitude
    var ellipseHeight = map(level, 0, mapMax, height*7/8, height*1/8);
    ellipse(width/2, ellipseHeight, 100, 100);
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
