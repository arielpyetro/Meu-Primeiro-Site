const text = "<Hello World/>";
const typingElement = document.getElementById('typing');
let index = 0;

function typeWriter() {
  if (index < text.length) {
    typingElement.innerHTML += text.charAt(index);
    index++;
    setTimeout(typeWriter, 150);
  } else {
    setTimeout(() => {
      typingElement.innerHTML = "";
      index = 0;
      typeWriter();
    }, 5000);
  }
}

typeWriter();


const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let width, height;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

resize();
window.addEventListener('resize', resize);

const starsCount = 200;
const stars = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

class Star {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.size = random(0.7, 1.5);
    this.baseSize = this.size;
    this.speed = random(0.01, 0.03);
    this.dx = 0;
    this.dy = 0;
  }
  update(mouseX, mouseY) {
    const distX = this.x - mouseX;
    const distY = this.y - mouseY;
    const dist = Math.sqrt(distX * distX + distY * distY);

    if (dist < 100) {
      this.dx = (distX / dist) * 1.5;
      this.dy = (distY / dist) * 0.5;
      this.size = Math.min(this.baseSize + 0.5, 2);
    } else {
      this.dx *= 0.95;
      this.dy *= 0.95;
      this.size += (this.baseSize - this.size) * 0.05;
    }

    this.x += this.dx;
    this.y += this.dy;

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }
  draw() {
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
    gradient.addColorStop(0, 'rgba(0, 255, 195, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 255, 195, 0)');

    ctx.fillStyle = gradient;
    ctx.shadowColor = '#00ffc3';
    ctx.shadowBlur = 10;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for(let i=0; i<starsCount; i++) {
  stars.push(new Star());
}

let mouseX = width / 2;
let mouseY = height / 2;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animate() {
  ctx.clearRect(0, 0, width, height);
  stars.forEach(star => {
    star.update(mouseX, mouseY);
    star.draw();
  });
  requestAnimationFrame(animate);
}

animate();
