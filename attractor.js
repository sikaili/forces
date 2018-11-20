function Attractor(x, y, m, bord) {
  this.note = map(mouseX, 0, width, 0, 5);
  this.note = Math.floor(note);
  let freq = midiToFreq(notes[note]);
  this.pos = createVector(x, y);
  this.mass = m;
  const G = 2;
  this.maxForce = 50;
  this.bord = bord
  let osca = new p5.Oscillator();
  osca.setType('sawtooth');
  osca.amp(0);
  osca.start();

  this.calForce = function(p) {
    this.vDiff = p5.Vector.sub(this.pos, p.pos);
    var distance = this.vDiff.mag();
    distance = constrain(distance, 5, 10);
    var strength = G * this.mass * p.mass / (distance * distance);
    var force = this.vDiff.setMag(strength);
    force.limit(this.maxForce);
    return force;
  }
  
  this.border = function(){
    if ((mouseX > this.pos.x-this.bord/2) && (mouseX<this.pos.x+this.bord/2)){
      if((mouseY > this.pos.y-this.bord/2) && (mouseY<this.pos.y+this.bord/2)){
        var del = 1
        return del
      }
    }
    
    
  }
  this.display = function() {
    push()
    fill(0, 127)
    noStroke()
    rect(this.pos.x+-0.5*bord, this.pos.y+-0.5*bord, this.bord, this.bord)
    pop()
  }

}