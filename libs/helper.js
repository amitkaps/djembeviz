// From Jason
// https://github.com/therewasaguy/p5-music-viz/blob/gh-pages/lib/helpers.js
// ================
// Helper Functions
// ================

// resize canvas on windowResized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

// T stands for toggleInput().
// note: in p5, keyPressed is not case sensitive. keyTyped is.
function keyPressed() {
  if (key == 'T') {
    toggleInput();
  }
}

// Toggle input and change which
// source is feeding the p5.Amplitude.
function toggleInput() {
  if (soundFile.isPlaying() ) {
    soundFile.pause();
    mic.start();
    amplitude.setInput(mic);
  } else {
    soundFile.play();
    mic.stop();
    amplitude.setInput(soundFile);
  }
}




// like map() but logarithmic.
// thx http://stackoverflow.com/questions/846221/logarithmic-slider
function logMap(val, inMin, inMax, outMin, outMax) {

  // log( = infinity)
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i] === 0) {
      arguments[i] = 0.0000000000000001;
    }
  }

  var minv = Math.log(outMin);
  var maxv = Math.log(outMax);

  var numerator = maxv - minv;
  var denom = inMax - inMin;

  // dont divide by zero
  if (denom === 0) {
    denom = 0.000000000001;
  }

  // calculate adjustment factor
  var scale = numerator / denom;

  return Math.exp(minv + scale*(val-inMin));
}
