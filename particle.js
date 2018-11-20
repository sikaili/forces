p5.disableFriendlyErrors = true;

function Particle(x, y, m, r, _style) {
  this.pos = createVector(x, y);
  this.mass = m;
  this.vel = createVector(1, 1);
  this.acc = createVector(0, 0);
  this.r = r/1.5 * m
  this.maxSpeed = 5;
  this.osc1 = new p5.Oscillator();
  this.osc1.setType('sine');
  this.osc1.freq(440);
  this.osc1.amp(0);
  this.inside = false;
  // if(this.mass>1){
    this.osc1.start();
  // } 
  let style = _style;
  this.count = 0
  this.applyForce = function(force) {
    let f = force.copy()
    this.force = p5.Vector.div(f, this.mass);
    this.acc.add(this.force);
  }
  this.bord = function(p) {
    let bord = 0.5 * p.bord
    let r = 50
    let note1 = map(this.r, 1, 50, 0, 5);
    let sound = map(note1, 0, 5,-12,12);
    note1 = Math.floor(note1);
    this.freq1 = midiToFreq(notes[note1]);
    this.osc1.freq(this.freq1);
    let note2 = map(p.pos.x, 0, width, 0, 5);
    // note2 = Math.floor(note2);
    // let freq2 = midiToFreq(notes[note2]-12);
    let pan = constrain(map(this.pos.x, 0, width, -1,1),-0.9,0.9);
    this.osc1.pan(pan);
    if(this.inside){
      this.osc1.amp(0.1,1);
      this.osc1.amp(0,5);
      this.inside = false;
    }
      if (((this.pos.x > p.pos.x - bord) && (this.pos.x < p.pos.x + bord))&&((this.pos.y > p.pos.y + bord && this.pos.y <p.pos.y + bord + 0.5 * r)||(this.pos.y < p.pos.y - bord && this.pos.y > p.pos.y - bord - 0.5 * r))) {
            this.inside=true;
            strokeWeight(2);
            line(p.pos.x,p.pos.y,this.pos.x,this.pos.y);
            if (Math.random()>0.6&&abs(this.vel.y)>0.8){
              this.vel.y *= -1
            }
            else{
              // this.fluide();
            }
      }
      else if (((this.pos.y > p.pos.y - bord) && (this.pos.y < p.pos.y + bord))&&((this.pos.x > p.pos.x + bord && this.pos.x <p.pos.x + bord + 0.5 * r)||(this.pos.x < p.pos.x - bord && this.pos.x > p.pos.x - bord - 0.5 * r))) {
            this.inside=true;
            strokeWeight(2);
            line(p.pos.x,p.pos.y,this.pos.x,this.pos.y);

            if (Math.random()>0.6&&abs(this.vel.x)>0.8){
              this.vel.x *= -1
            }
            else{
              // this.fluide();
            }
      }
  }
  
    this.separation = function(particles){
    let targetAll = createVector();
    let count = 0;
    for (let j=0;j<particles.length;j++){
      this.disRange = (this.r)/2;
      let distance = p5.Vector.dist(this.pos,particles[j].pos);
      // if(distance >50 && distance<80&&Math.random()>0.5){
      //   line(particles[j].pos.x,particles[j].pos.y,this.pos.x,this.pos.y);
      // }
      if ((distance > 0) && (distance < this.disRange)){
        let targetS = p5.Vector.sub(particles[j].pos,this.pos);
        targetS.div(distance*-1);
        targetAll.add(targetS);
        count ++;
      }
      if (count>0){
        targetAll.div(count);
        targetAll.normalize();
        targetAll.mult(this.maxSpeed*20);
        let steer = p5.Vector.sub(targetAll, this.velocity);
        this.applyForce(steer);
      }

    }
  }
  this.fluide = function() {
        let maxi = 0.3
        let stren = this.vel.mag()
        let strength = stren * stren / 3;
        let force1 = this.vel.copy();
        force1.setMag(strength*1.3);
        force1.mult(-1);
        this.applyForce(force1);
  }
  
  this.update = function() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed)
    this.pos.add(this.vel);
    this.acc.set(0, 0)
  }
  this.display = function(xoff) {
    let n = map(noise(xoff), 0, 1, -0.5, 0.5);
    let m = 0.33 * (Sin(20) * 0.3 + n/ 6);
    this.r += m/3;
    this.r > 100 ? this.r/=2 :"";
    // x += 0.03;
    let theta = this.vel.heading() + 0.5 * PI
    if (style == 1) {
      stroke(225, 100, 125)
      fill(200, 0, 0, 80)
      ellipse(this.pos.x, this.pos.y, this.r, this.r)
      fill(0, 160);
      push();
      stroke(0, 140)
      strokeWeight(2)
      translate(this.pos.x, this.pos.y);
      rotate(theta + n / 3)
      line(0, this.r * 0.4, 0, -this.r * 0.4)
      pop();
    }
    if (style == 2) {
      stroke(100, 100, 225, 80)
      this.r = r + (this.mass * n * 80);
      fill(0, 180, 100, 80)
      ellipse(this.pos.x, this.pos.y, this.r, this.r)
      fill(0, 160);
      push();
      stroke(255, 190)
      strokeWeight(1)
      translate(this.pos.x, this.pos.y);
      rotate(theta + n)
      line(0, this.r * 0.4, 0, -this.r * 0.4)
      pop();
    }
  }

}