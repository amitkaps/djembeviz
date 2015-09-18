// Preload a Song and get its volume (amplitude)
// Use the amplitute to develop the beat algorithm
// Decide at what threshold level is there a beat and then select it
// Uses cutoff and decay values to prevent a beat being picked immediately

var mic;
var song;
var volume;
var mapMax = 1;

// For beat calculation
var threshold = 0.08;
var cutoff = 0;
var decayRate = 0.90;
var beat;
var size;

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
  volume = new p5.Amplitude();
  volume.setInput(mic);

}

function draw() {

    // Repaint the canvas as black
    background(17,17,17);
    fill('#E7AD52');

    // text('press t to toggle source', 20, height - 60);

    // Get the level of the Amplitude
    var level = volume.getLevel();
    // text('volume: ' + level, 20, height - 60);


    // If the volume > threshold + cutoff, then we have a beat
    if (level > threshold + cutoff) {
      beat = 1;
      size = 100;
      fill(255,0,0);
      // Increase the cutoff
      cutoff = 0.05;
    } else {
      beat = 0;
      size = 25;
    }

    // Start decaying the cutoff
    cutoff = cutoff * decayRate;

    //console.log (threshold + cutoff, level);

    // Draw the max and min lines
    strokeWeight(1);
    stroke('#E7AD52');
    line(width*2/8, height*7/8, width*6/8, height*7/8);
    line(width*2/8, height*1/8, width*6/8, height*1/8);

    noStroke();

    // map ellipse height to the volume level - log scale
    var ellipseHeight = map(-Math.log2(level + 0.01), -Math.log2(0.01), -Math.log2(mapMax), height*7/8, height*1/8);
    ellipse(width/2, ellipseHeight, size, size);
    // console.log(ellipseHeight);

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
    volume.setInput(mic);
  } else {
    song.play();
    mic.stop();
    volume.setInput(song);
  }
}
