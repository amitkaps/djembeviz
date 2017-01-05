// Preload a Song and get its volume (amplitude)
// Use the amplitute to develop the beat algorithm
// Decide at what threshold level is there a beat and then select it
// Uses cutoff and decay values to prevent a beat being picked immediately

var mic;
var song;
var beatvolume;
var mapMax = 1;

// For beat calculation
var threshold = 0.06;
var cutoff = 0;
var cutoffAdd = 0.2;
var decayRate = 0.85;
var beat;
var size;

// To start and stop finding beats
var beatFind = 1;
var beatHold = 10;
var beatFrame = 0;

function preload() {
  song = loadSound('../../song/djembesample.mp3');
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
  beatvolume = new p5.Amplitude();
  beatvolume.setInput(mic);

}

function draw() {

    // Repaint the canvas as black
    background(17,17,17);
    fill('#E7AD52');

    // text('press t to toggle source', 20, height - 60);

    // Get the level of the Amplitude
    var level = beatvolume.getLevel();
    // text('volume: ' + level, 20, height - 60);


    // If the volume > threshold + cutoff and not find beat recently, then we have a beat
    if ((level > threshold + cutoff) && (beatFind === 1)) {
      beat = 1;
      size = 100;

      // Reset the beatFrame count
      beatFrame = 0;

      // Stop finding new beats
      beatFind = 0;

      // Increase the cutoff
      cutoff = cutoffAdd;

    } else {
      beat = 0;
      size = 25;

      if (beatFrame <= beatHold){
        beatFrame ++;
      }
      else {
        // Start finding beats
        beatFind = 1;
        // Start decaying the cutoff
        cutoff = cutoff * decayRate;
      }
    }

    //console.log (threshold + cutoff, level);

    // Draw the max and min lines
    strokeWeight(3);
    stroke(231,173,82);
    line(width*2/8, height*7/8, width*6/8, height*7/8);
    line(width*2/8, height*1/8, width*6/8, height*1/8);

    stroke(231,173,82,126);
    var thresh = map(-Math.log2(threshold + cutoff + 0.01), -Math.log2(0.01), -Math.log2(mapMax), height*7/8, height*1/8);
    line(width*2/8, thresh, width*6/8, thresh);

    noStroke();

    fill(231,173,82);
    if(beat === 1) {
      fill(255,0,0);
    }

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
    beatvolume.setInput(mic);
  } else {
    song.play();
    mic.stop();
    beatvolume.setInput(song);
  }
}
