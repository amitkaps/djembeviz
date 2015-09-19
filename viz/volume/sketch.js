// Preload a Song and get its amplitude
// Visualise using an ellipse jumping between min and max lines

var mic;
var song;
var amplitude;
var mapMax = 1;


function preload() {
  song = loadSound('../../song/teach.mp3');
}


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

    // Get the level of the volume
    var level = amplitude.getLevel();
    // text('volume: ' + level, 20, height - 60);


    // var size = map(level, 0, 1, 0, 1200);
    // ellipse(width/2, height/2, size, size);

    // Draw the max and min lines
    strokeWeight(3);
    stroke('#E7AD52');
    line(width*2/8, height*7/8, width*6/8, height*7/8);
    line(width*2/8, height*1/8, width*6/8, height*1/8);

    noStroke();

    // map ellipse height to the volume - normal scale
    // var ellipseHeight = map(level, 0, mapMax, height*7/8, height*1/8);

    // map ellipse height to the volume level - log scale
    var ellipseHeight = map(-Math.log2(level + 0.01), -Math.log2(0.01), -Math.log2(mapMax), height*7/8, height*1/8);
    ellipse(width/2, ellipseHeight, 75, 75);
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
