p5.disableFriendlyErrors = true;
document.addEventListener('ontouchmove', function (e) {
  e.preventDefault();
}, {
  passive: false
});
document.addEventListener('touchmove', function (n) {
  n.preventDefault();
}, {
  passive: false
});

let env;
let xoff = 0;
let atrs = [];
let particles = [];
let state = -1;
let count = 0;
let forces = [];
const texts = ['Traverser', 'La', 'Mer', 'Sans', 'Que', 'Le', 'Ciel', 'Ne', 'Le', 'Sache'];
const texts1 = ['瞒', '天', '过', '海'];
let sin3;
let osc, osc1, osc2;
let note, freq;
let t1 = 0,
  t2 = 0,
  t3 = 0,
  m = 0,
  m1 = 0,
  amass = 0;
let reverb, delay, filter1;
const notes = [48, 57, 60, 64, 67, 72];
let dc;

function setup() {
  reverb = new p5.Reverb();
  delay = new p5.Delay();
  filter1 = new p5.LowPass();
  masterVolume(0.3, 0.5)
  osc = new p5.Oscillator();
  osc.setType('sawtooth');
  osc.freq(240);
  osc.amp(0);
  osc.start();
  createCanvas(windowWidth, windowHeight)
  atrs[0] = new Attractor(0.5 * windowWidth, windowHeight + 30, 0.01);
  for (let i = 0; i < 25; i++) {
    particles[i] = new Particle(random(100, 300), random(100, 300), random(0.3, 2), 60, int(random(1, 3)))
    if(i%5==0){
      let dump = new Attractor(random(windowWidth), random(windowHeight), random(50,300));
      atrs.push(dump);
    }
  }
  textSize(15)
  textFont("Helvetica")
  textAlign(LEFT)
  delay.process(osc, 0.96, 0.7, 880)
  osc.connect(filter1)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  background(50, 50, 200)

}

function Sin(n) {
  let i = Math.sin(millis() / 1000 * 2 * PI / n);
  return i
}

function Cos(n) {
  let i = Math.cos(millis() / 1000 * 2 * PI / n);
  return i
}

function draw() {
  background(40, 40, 180)
  let freq1 = map(mouseY, -0.3 * height, height, 10000, 20);
  filter1.freq(freq1);
  if (touches.length > 1 || state == 4) {
    for (let d = 0; d < atrs.length; d++) {
      let dele = atrs[d].border();
      if (dele == 1 && atrs.length > 1) {
        atrs[d].pos.x = mouseX;
        atrs[d].pos.y = mouseY;
        state = 2;
      }
    }
  }
  // START STATE
  if (state == -1) {
    push()
    stroke(0, 0)
    fill(255, (Sin(1.5) + 1) * 60)
    textSize(30)
    textAlign(CENTER)
    text("Please drag to interact...", 0.5 * windowWidth, windowHeight - 250)
    pop()
  }
  // Create Attractors and Particles
  xoff += 0.01;

  for (let o = 0; o < particles.length; o++) {
    particles[o].separation(particles);
    for (let l = 0; l < atrs.length; l++) {
      forces[o] = atrs[l].calForce(particles[o]);
      particles[o].bord(atrs[l]);
      particles[o].applyForce(forces[o]);
    }
    particles[o].update();
    particles[o].display(xoff);
  }

  // display all the attractors
  for (let l = 0; l < atrs.length; l++) {
    atrs[l].display();
    push()
    noStroke()
    if (l == 0) {
      fill(0);
    } else {
      fill(255);
    }
    if (l > 0) {
      m = (l - 1) % texts.length;
      m1 = m % texts1.length;
      text(texts[m], atrs[l].pos.x - 35, atrs[l].pos.y, 25, 50);
      text(texts1[m1], atrs[l].pos.x - 35, atrs[l].pos.y - 30 - Math.random() * 4, 25, 50);
    }
    pop()
  }
}

function touchMoved() {
  note = map(mouseX, 0, width, 0, 5);
  note = Math.floor(note);
  freq = midiToFreq(notes[note]);
  osc.pan(map(mouseX / width, 0, 1, -0.7, 0.7))
  osc.freq(freq);
  osc.amp(0.17, 0.4);
  osc.phase(mouseX / width)
  state = 4;
}

function touchStarted() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
    masterVolume(0.3, 0.5)
  };

  t1 = frameCount
  state = 0
  note = map(mouseX, 0, width, 0, 5);
  note = Math.floor(note);
  freq = midiToFreq(notes[note]);
  for (let d = 0; d < atrs.length; d++) {
    let dele = atrs[d].border();
    if (dele == 1 && atrs.length > 1 && state !== 2) {
      count -= 1
      atrs.splice(d, 1);
      state = 3
    }
  }
  osc.pan(map(mouseX / width, 0, 1, -0.7, 0.7))
  osc.freq(freq + Sin(3) * 1);
  osc.amp(0.17, 0.4);

}

function touchEnded() {
  t2 = frameCount
  t3 = t2 - t1
  // hold longer to create a bigger attractor
  amass = map(t3, 5, 150, 10, 800);
  amass = constrain(amass, 25, 500)
  // delete attractor
  // new attractor 
  let abord = amass * 2.828 * 1.2
  if (state !== 2 && state !== 3 && t3 > 2) {
    let at = new Attractor(mouseX, mouseY, amass, abord);
    atrs.push(at);
  }
  state = 1;
  count += 1;
  osc.freq(freq / 2)
  osc.amp(0, 0.7);

}
document.ontouchmove = function (e) {
  e.preventDefault();
}
