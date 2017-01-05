// Visualise the frequency log domain using FFT

var mic
var song;
var analyzer;

// Array of amplitude values (-1 to +1) over Frequency.
var samples = [];
var currentSource = "mic";

// Create Bass Band and Slider variable
var bassBand = 10;
var bassSlider;
var maxBand;
var maxValue;
var bass;




// Create an array to store amplitude over time & size
var prevBins = new Array(80);
var prevBeat = new Array(80);
var prevBass = new Array(80)

function preload() {
  song = loadSound('../../song/bass_tone_slap.mp3');
}


function setup() {
  // Create a black canvas for the entire window
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1)
  background(0,0,0);

  // create sliders
  //bassSlider = createSlider(0, 50, bassBand);
  //bassSlider.position(width*6/8, height*1/8);

  // Start the microphone and use for input
  mic = new p5.AudioIn();
  mic.start();

  // Start the FFT analyzer for the song, default 1024 bin
  analyzer = new p5.FFT(0.8, 1024);
  analyzer.setInput(mic);
  //peak = new p5.PeakDetect();

  angleMode(RADIANS);

}

function draw() {
  translate(width/2, height/2);

  // Repaint the canvas as black
  background(0,0,0,0.05);
  //fill(37,61,90);
  noStroke();
  // text('press t to toggle source', 20, height - 60);

  // Set the Slidervalues
  //bassBand = bassSlider.value();
  bassBand = 10;
  fill(100);
  // textSize(30);
  // textAlign(CENTER);
  // text(frameCount, width/2, 100);


  // get a buffer of 1024 samples over Frequency.
  samples = analyzer.analyze();
  var bins = samples.length;
  binwidth = width / bins;


  // Find out the max band
  maxBand = -1;
  maxValue = 0;
  for (var i = 0; i < bins; i++){
    if (samples[i] > maxValue) {
      maxValue = samples[i];
      maxBand = i;
    }
  }

  if (maxBand <= bassBand) {
    bass = 1;
  } else {
    bass = 0;
  }


  // Create Slider Text
  //fill(200)
  //text('Bass Band Select: ' + bassBand, width*6/8, height*1/8 - 10);

  drawSample(20, bassBand, bass);

}


// min radius of ellipse
var minRad = 0.2;

// max radius of ellipse
var maxRad = 1;

function drawSample(bins, bassBand, bass){
  var xcum = 0;
  for (var i = 0; i < bins; i++){
    //var x = map(Math.log2(i+2), 0, Math.log2(bins+2), 0, width);
    var x = map(i, 0, bins, 0, width);
    var l = map(samples[i], 0, 255, 0, height);
    var y = height - l;
    var c = color(round(map(i, 0, bins, 0, 360)), 100, 100, 0);

    var angle = map(i, 0, bins, 0, 2*PI);
    var offset = map(samples[i], 0, 1, 0, maxRad) + minRad;
    console.log(angle, offset);

    var xx = (offset) * cos(angle + random(0.05));
    var yy = (offset) * sin(angle + random(0.05));

    if (bass === 1) {
        if (i <= bassBand) {
          c = color(round(map(i, 0, bins, 0, 360)), 100, 100, 0.8);
        }
      } else {
        if (i > bassBand){
          c = color(round(map(i, 0, bins, 0, 360)), 100, 100, 0.8);
        }
      }
    fill(c);
  //  console.log(xx,yy)
    ellipse (xx, yy, 20 , 20)
    //ellipse(xcum, height/2,x-xcum, l/2);
    //rect(xcum, y, x - xcum, l);
    xcum = x;
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

// ===========
// Bird Class
// ===========

function Bird(index) {
  this.index = index;
  this.location = createVector(0, 0);

  var angle = map(index, 0, birdCount, 0, TWO_PI);
  this.angle = p5.Vector.fromAngle(angle);

  this.velocity = p5.Vector.random2D();
  this.acceleration = createVector(0, 0);

  this.maxforce = random(0.01, 0.1);
  this.maxspeed = random(1, 3);

  this.r = 5; //radius of the "bird"
}

Bird.prototype.seek = function(fftAmp) {
  // bird seeks angle by fftAmp
  var newTarget = createVector(this.angle.x, this.angle.y);
  newTarget.mult(fftAmp);

  var desired = p5.Vector.sub(newTarget, this.location);

  //normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);

  // Steering = Desired minus velocity (just remember this magic formule..)
  var steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce); //don't turn too fast, otherwise we lost the steering animation

  //apply the force, we got the acceleration!
  this.acceleration.add(steer);
};

Bird.prototype.update = function() {

  //update velocity
  this.velocity.add(this.acceleration);

  //limit speed
  this.velocity.limit(this.maxspeed);
  this.location.add(this.velocity);

  //reset acceleration to 0 each cycle.
  this.acceleration.mult(0);

  this.checkEdges();
};

Bird.prototype.display = function() {
  fill(this.index, 255, 255);
  ellipse(this.location.x, this.location.y, this.r, this.r);
};


// prevent birds from flying off screen
Bird.prototype.checkEdges = function() {
  var x = this.location.x;
  var y = this.location.y;

  if (x > width || x < 0 || y > height || y < 0) {
    x = width/2;
    y = height/2;
  }

};
