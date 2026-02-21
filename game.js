const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const healthEl = document.getElementById("health");
const waveEl = document.getElementById("wave");
const keys = new Set();
const mouse = { x: canvas.width / 2, y: canvas.height / 2, down: false };

const state = { running: true, score: 0, wave: 1, spawnTimer: 0, spawned: 0, target: 10 };
const player = { x: canvas.width/2, y: canvas.height/2, r: 14, speed: 270, hp: 100, cd: 0, fireRate: 0.16 };
const bullets = [];
const enemies = [];
let last = performance.now();

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => Math.random() * (b - a) + a;

function spawnEnemy() {
  const s = Math.floor(Math.random() * 4);
  let x = 0, y = 0;
  if (s === 0) { x = rand(0, canvas.width); y = -20; }
  if (s === 1) { x = canvas.width + 20; y = rand(0, canvas.height); }
  if (s === 2) { x = rand(0, canvas.width); y = canvas.height + 20; }
  if (s === 3) { x = -20; y = rand(0, canvas.height); }
  enemies.push({ x, y, r: 12, speed: rand(60, 110) + state.wave * 6, hp: 1 + Math.floor(state.wave/3) });
  state.spawned++;
}

function fire() {
  const dx = mouse.x - player.x, dy = mouse.y - player.y;
  const m = Math.hypot(dx, dy) || 1;
  bullets.push({ x: player.x, y: player.y, vx: dx/m*560, vy: dy/m*560, r: 4, life: 1 });
}

function update(dt) {
  if (!state.running) return;
  let mx = 0, my = 0;
  if (keys.has("w") || keys.has("arrowup")) my--;
  if (keys.has("s") || keys.has("arrowdown")) my++;
  if (keys.has("a") || keys.has("arrowleft")) mx--;
  if (keys.has("d") || keys.has("arrowright")) mx++;
  const mm = Math.hypot(mx, my) || 1;
  player.x = clamp(player.x + mx/mm*player.speed*dt, player.r, canvas.width-player.r);
  player.y = clamp(player.y + my/mm*player.speed*dt, player.r, canvas.height-player.r);

  player.cd -= dt;
  if ((mouse.down || keys.has(" ")) && player.cd <= 0) { fire(); player.cd = player.fireRate; }

  state.spawnTimer -= dt;
  if (state.spawned < state.target && state.spawnTimer <= 0) { spawnEnemy(); state.spawnTimer = Math.max(0.2, 0.75 - state.wave*0.05); }
  if (state.spawned >= state.target && enemies.length === 0) {
    state.wave++; state.spawned = 0; state.target = 8 + state.wave*3;
    player.hp = clamp(player.hp + 8, 0, 100);
    waveEl.textContent = `Wave: ${state.wave}`;
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx*dt; b.y += b.vy*dt; b.life -= dt;
    if (b.life <= 0 || b.x < -20 || b.y < -20 || b.x > canvas.width+20 || b.y > canvas.height+20) bullets.splice(i, 1);
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    const dx = player.x - e.x, dy = player.y - e.y, m = Math.hypot(dx, dy) || 1;
    e.x += dx/m*e.speed*dt; e.y += dy/m*e.speed*dt;

    if (m < e.r + player.r) { player.hp -= 24*dt; if (player.hp <= 0) { player.hp = 0; state.running = false; } }

    for (let j = bullets.length - 1; j >= 0; j--) {
      const b = bullets[j];
      if (Math.hypot(b.x - e.x, b.y - e.y) < b.r + e.r) {
        bullets.splice(j, 1); e.hp--;
        if (e.hp <= 0) { enemies.splice(i, 1); state.score += 10; scoreEl.textContent = `Score: ${state.score}`; }
        break;
      }
    }
  }

  healthEl.textContent = `Health: ${Math.floor(player.hp)}`;
}

function render() {
  ctx.fillStyle = "#0b1020"; ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(148,163,184,.08)";
  for (let x = 0; x < canvas.width; x += 32) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
  for (let y = 0; y < canvas.height; y += 32) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }

  ctx.fillStyle = "#fff";
  for (const b of bullets) { ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill(); }

  for (const e of enemies) { ctx.fillStyle = "#fb7185"; ctx.beginPath(); ctx.arc(e.x,e.y,e.r,0,Math.PI*2); ctx.fill(); }

  ctx.fillStyle = "#22d3ee";
  ctx.beginPath(); ctx.arc(player.x, player.y, player.r, 0, Math.PI*2); ctx.fill();

  const dx = mouse.x - player.x, dy = mouse.y - player.y, m = Math.hypot(dx,dy) || 1;
  ctx.strokeStyle = "#67e8f9"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(player.x, player.y); ctx.lineTo(player.x + dx/m*(player.r+10), player.y + dy/m*(player.r+10)); ctx.stroke();

  if (!state.running) {
    ctx.fillStyle = "rgba(0,0,0,.5)"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.font = "bold 48px Trebuchet MS";
    ctx.fillText("Game Over", canvas.width/2, canvas.height/2);
    ctx.font = "20px Trebuchet MS"; ctx.fillText("Press R to restart", canvas.width/2, canvas.height/2 + 36);
  }
}

function reset() {
  state.running = true; state.score = 0; state.wave = 1; state.spawnTimer = 0; state.spawned = 0; state.target = 10;
  player.x = canvas.width/2; player.y = canvas.height/2; player.hp = 100; player.cd = 0;
  bullets.length = 0; enemies.length = 0;
  scoreEl.textContent = "Score: 0"; healthEl.textContent = "Health: 100"; waveEl.textContent = "Wave: 1";
}

function frame(now) {
  const dt = Math.min(0.033, (now - last) / 1000); last = now;
  update(dt); render(); requestAnimationFrame(frame);
}

window.addEventListener("keydown", e => {
  const k = e.key.toLowerCase(); keys.add(k);
  if (k === "r" && !state.running) reset();
  if (["arrowup","arrowdown","arrowleft","arrowright"," "].includes(k)) e.preventDefault();
});
window.addEventListener("keyup", e => keys.delete(e.key.toLowerCase()));
canvas.addEventListener("mousemove", e => {
  const r = canvas.getBoundingClientRect();
  mouse.x = (e.clientX - r.left) * (canvas.width / r.width);
  mouse.y = (e.clientY - r.top) * (canvas.height / r.height);
});
canvas.addEventListener("mousedown", e => { if (e.button === 0) mouse.down = true; });
window.addEventListener("mouseup", () => { mouse.down = false; });

requestAnimationFrame(frame);
