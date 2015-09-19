// Preload a Song and get its volume (amplitude)
// Use the amplitute to develop the beat algorithm
// Decide at what threshold level is there a beat and then select it
// Uses cutoff and decay values + beat hold frame to prevent a beat being picked immediately
// Now show the amplitude over time

var mic;
var song;
var rhythmvolume;
var mapMax = 1;

// For beat calculation
var threshold = 0.06;
var cutoffAdd = 0.2;
var decayRate = 0.85;

var cutoff = 0;
var beat;
var size;

// To start and stop finding beats
var beatFind = 1;
var beatHold = 10;
var beatFrame = 0;

// Declare slider variables
var thresholdSlider;
var cutoffAddSlider;
var decayRateSlider;
var beatHoldSlider;

// Create an array to store amplitude over time & size
var prevLevels = new Array(80);
var prevBeat = new Array(80);

function preload() {
  song = loadSound('../../song/teach.mp3');
}


function setup() {
  // Create a black canvas for the entire window
  createCanvas(windowWidth, windowHeight);
  background(17,17,17);
  fill('#f3d7ac');
  noStroke();

  // create sliders
  thresholdSlider = createSlider(0, 30, threshold*100);
  thresholdSlider.position(width*13/16, height*7/8 - 20);
  cutoffAddSlider = createSlider(0, 10, cutoffAdd * 10);
  cutoffAddSlider.position(width*13/16, height*7/8 - 80);
  decayRateSlider = createSlider(0, 100, decayRate * 100);
  decayRateSlider.position(width*13/16, height*7/8 - 140);
  beatHoldSlider = createSlider(0, 120, beatHold);
  beatHoldSlider.position(width*13/16, height*7/8 - 200);

  // Start the microphone and use for input
  mic = new p5.AudioIn();
  mic.start();

  // Get the amplitude (volume) of the song
  rhythmvolume = new p5.Amplitude();
  rhythmvolume.setInput(mic);

}

function draw() {

    // Repaint the canvas as black
    background(17,17,17);
    fill('#E7AD52');

    // text('press t to toggle source', 20, height - 60);

    // Set the Slidervalues
    threshold = thresholdSlider.value() / 100;
    cutoffAdd = cutoffAddSlider.value() / 10;
    decayRate = decayRateSlider.value() / 100;
    beatHold = beatHoldSlider.value();

    // Create Slider Text
    fill(200)
    text('Threshold: ' + nf(threshold,1,2), width*13/16, height*7/8 - 30);
    text('Cutoff Adder: ' + cutoffAdd, width*13/16, height*7/8 - 90);
    text('Decay Rate: ' + decayRate, width*13/16, height*7/8 - 150);
    text('Beats Hold: ' + beatHold, width*13/16, height*7/8 - 210);

    fill('#E7AD52');
    // Get the level of the Amplitude
    var level = rhythmvolume.getLevel();
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
    line(width*1/16, height*7/8, width*6/8, height*7/8);
    line(width*1/16, height*1/8, width*6/8, height*1/8);

    stroke(231,173,82, 126);
    var thresh = map(-Math.log2(threshold + cutoff + 0.01), -Math.log2(0.01), -Math.log2(mapMax), height*7/8, height*1/8);
    line(width*1/16, thresh, width*6/8, thresh);

    noStroke();

    // add new level to end of array
    prevLevels.push(level);
    prevBeat.push(beat);

    // remove first item in array
    prevLevels.splice(0, 1);
    prevBeat.splice(0, 1);

    // rectangle variables - padding(p) and width(w)
    var p = 5;
    var w = width * 6 / 8 / prevLevels.length - p;

    // loop through all the previous levels
    for (var i = 0; i < prevLevels.length; i++) {

      // map x to be equally space on the x-axis
      var x = map(i, prevLevels.length, 0, width*1/16, width*6/8);

      // map y to the volume level - log scale
      var y = map(-Math.log2(prevLevels[i] + 0.01), -Math.log2(0.01), -Math.log2(mapMax), height*7/8, height*1/8);
      // ellipse(x, y, prevSizes[i], prevSizes[i]);

      fill('#E7AD52');
      if(prevBeat[i] === 1) {
        fill(255,0,0);
      }
      // Draw the rectangles starting for the last edge
      rect(x - w - p/2, y, w, height * 7/8 - y);
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
    rhythmvolume.setInput(mic);
  } else {
    song.play();
    mic.stop();
    rhythmvolume.setInput(song);
  }
}
