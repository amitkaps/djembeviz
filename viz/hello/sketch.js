
function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
    frameRate(5);
    background(17,17,17,40);
    fill(231,173,82);
    noStroke();
    x = random(width);
    y = random(height);
    ellipse(x, y, 100, 100);
}
