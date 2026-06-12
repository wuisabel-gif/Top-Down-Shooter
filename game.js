const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const radar = document.getElementById("radar");
const radarCtx = radar.getContext("2d");

const hud = {
  healthFill: document.getElementById("healthFill"),
  healthValue: document.getElementById("healthValue"),
  levelValue: document.getElementById("levelValue"),
  waveValue: document.getElementById("waveValue"),
  enemiesValue: document.getElementById("enemiesValue"),
  currencyValue: document.getElementById("currencyValue"),
  scoreValue: document.getElementById("scoreValue"),
  objectiveText: document.getElementById("objectiveText"),
  objectiveCheck: document.getElementById("objectiveCheck"),
  xpFill: document.getElementById("xpFill"),
  xpValue: document.getElementById("xpValue"),
  weaponList: document.getElementById("weaponList"),
  perkList: document.getElementById("perkList"),
  damageStat: document.getElementById("damageStat"),
  fireRateStat: document.getElementById("fireRateStat"),
  speedStat: document.getElementById("speedStat"),
  critStat: document.getElementById("critStat"),
  maxHealthStat: document.getElementById("maxHealthStat"),
};

const keys = new Set();
const mouse = { x: canvas.width / 2, y: canvas.height / 2, down: false };
const world = { width: 1280, height: 720 };

const weapons = [
  {
    id: "pistol",
    name: "Pistol",
    ammo: 6,
    icon: "assets/ui/icons/weapons/pistol.png",
    cooldown: 0.18,
    damage: 25,
    speed: 700,
    projectileRadius: 4,
    projectileLife: 1,
    color: "#f6fdff",
    trailColor: "rgba(87, 231, 255, 0.3)",
    pellets: 1,
    spread: 0,
    pierce: 0,
    recoil: 2,
  },
  {
    id: "shotgun",
    name: "Shotgun",
    ammo: 5,
    icon: "assets/ui/icons/weapons/shotgun.png",
    cooldown: 0.52,
    damage: 13,
    speed: 620,
    projectileRadius: 3.5,
    projectileLife: 0.42,
    color: "#aef8ff",
    trailColor: "rgba(87, 231, 255, 0.22)",
    pellets: 7,
    spread: 0.38,
    pierce: 0,
    recoil: 5,
  },
  {
    id: "laser",
    name: "Laser",
    ammo: 4,
    icon: "assets/ui/icons/weapons/laser.png",
    cooldown: 0.09,
    damage: 9,
    speed: 1040,
    projectileRadius: 3,
    projectileLife: 0.58,
    color: "#47a8ff",
    trailColor: "rgba(36, 169, 255, 0.42)",
    pellets: 1,
    spread: 0,
    pierce: 4,
    recoil: 1,
  },
  {
    id: "rocket",
    name: "Rocket",
    ammo: 3,
    icon: "assets/ui/icons/weapons/rocket_launcher.png",
    cooldown: 0.82,
    damage: 42,
    speed: 430,
    projectileRadius: 7,
    projectileLife: 1.45,
    color: "#ffec8a",
    trailColor: "rgba(255, 85, 54, 0.42)",
    pellets: 1,
    spread: 0,
    pierce: 0,
    splashRadius: 74,
    splashDamage: 32,
    recoil: 8,
  },
];

const perks = [
  { name: "Rapid Fire", icon: "assets/ui/icons/perks/rapid_fire.png" },
  { name: "Max Health", icon: "assets/ui/icons/perks/max_health.png" },
  { name: "Speed Boost", icon: "assets/ui/icons/perks/speed_boost.png" },
  { name: "Piercing", icon: "assets/ui/icons/perks/piercing.png" },
  { name: "Regen", icon: "assets/ui/icons/perks/regeneration.png" },
  { name: "Crit Damage", icon: "assets/ui/icons/perks/crit_damage.png" },
];

const state = {
  running: true,
  score: 0,
  currency: 0,
  wave: 1,
  level: 1,
  xp: 0,
  nextXp: 100,
  spawnTimer: 0,
  spawned: 0,
  target: 10,
  activeWeapon: 0,
  shake: 0,
  flashTimer: 0,
};

const player = {
  x: world.width / 2,
  y: world.height / 2,
  r: 15,
  speed: 270,
  maxHp: 100,
  hp: 100,
  cd: 0,
  damageBonus: 0,
  critChance: 0.15,
};

const bullets = [];
const enemies = [];
const particles = [];
const popups = [];
let last = performance.now();

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => Math.random() * (b - a) + a;
const pct = (value, max) => `${clamp((value / max) * 100, 0, 100)}%`;

function setupHud() {
  hud.weaponList.innerHTML = weapons.map((weapon, index) => `
    <div class="weapon-row ${index === state.activeWeapon ? "active" : ""}">
      <span class="weapon-slot">${index + 1}</span>
      <img class="weapon-icon" src="${weapon.icon}" alt="" aria-hidden="true">
      <span>
        <span class="weapon-name">${weapon.name}</span>
        <span class="ammo-pips">${Array.from({ length: 7 }, (_, pip) => (
          `<span class="${pip < weapon.ammo ? "filled" : ""}"></span>`
        )).join("")}</span>
      </span>
    </div>
  `).join("");

  hud.perkList.innerHTML = perks.map((perk) => `
    <div class="perk-card">
      <img class="perk-icon" src="${perk.icon}" alt="" aria-hidden="true">
      <span class="perk-name">${perk.name}</span>
    </div>
  `).join("");
}

function spawnEnemy() {
  const side = Math.floor(Math.random() * 4);
  let x = 0;
  let y = 0;

  if (side === 0) { x = rand(0, world.width); y = -24; }
  if (side === 1) { x = world.width + 24; y = rand(0, world.height); }
  if (side === 2) { x = rand(0, world.width); y = world.height + 24; }
  if (side === 3) { x = -24; y = rand(0, world.height); }

  const elite = state.wave % 3 === 0 && Math.random() < 0.22;
  enemies.push({
    x,
    y,
    r: elite ? 17 : 12,
    speed: rand(64, 112) + state.wave * 6 - (elite ? 16 : 0),
    hp: 1 + Math.floor(state.wave / 3) + (elite ? 2 : 0),
    maxHp: 1 + Math.floor(state.wave / 3) + (elite ? 2 : 0),
    elite,
    hitTimer: 0,
  });
  state.spawned++;
}

function addParticles(x, y, color, count, power = 1) {
  for (let i = 0; i < count; i++) {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(40, 220) * power;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: rand(1.5, 4.5) * power,
      life: rand(0.18, 0.55),
      maxLife: 0.55,
      color,
    });
  }
}

function addPopup(x, y, text, color = "#eaf8ff") {
  popups.push({ x, y, text, color, life: 0.85, vy: -35 });
}

function fire() {
  const dx = mouse.x - player.x;
  const dy = mouse.y - player.y;
  const m = Math.hypot(dx, dy) || 1;
  const nx = dx / m;
  const ny = dy / m;

  bullets.push({
    x: player.x + nx * 18,
    y: player.y + ny * 18,
    vx: nx * 650,
    vy: ny * 650,
    r: 4,
    life: 1.05,
    trail: [],
  });

  state.flashTimer = 0.07;
  state.shake = Math.max(state.shake, 2);
  addParticles(player.x + nx * 24, player.y + ny * 24, "#62eaff", 5, 0.8);
}

function completeWave() {
  state.wave++;
  state.spawned = 0;
  state.target = 8 + state.wave * 3;
  state.spawnTimer = 0;
  player.hp = clamp(player.hp + 12, 0, player.maxHp);
  addPopup(player.x, player.y - 35, `Wave ${state.wave}`, "#57e7ff");
  state.shake = 5;
}

function gainRewards(enemy) {
  state.score += enemy.elite ? 30 : 10;
  state.currency += enemy.elite ? 7 : 3;
  state.xp += enemy.elite ? 24 : 12;

  if (state.xp >= state.nextXp) {
    state.xp -= state.nextXp;
    state.level++;
    state.nextXp += 50;
    player.damage += 3;
    player.hp = clamp(player.hp + 18, 0, player.maxHp);
    addPopup(player.x, player.y - 48, "Level Up", "#ffd13f");
    state.shake = 7;
  }
}

function updatePlayer(dt) {
  let mx = 0;
  let my = 0;
  if (keys.has("w") || keys.has("arrowup")) my--;
  if (keys.has("s") || keys.has("arrowdown")) my++;
  if (keys.has("a") || keys.has("arrowleft")) mx--;
  if (keys.has("d") || keys.has("arrowright")) mx++;

  const mm = Math.hypot(mx, my) || 1;
  player.x = clamp(player.x + (mx / mm) * player.speed * dt, player.r, world.width - player.r);
  player.y = clamp(player.y + (my / mm) * player.speed * dt, player.r, world.height - player.r);

  player.cd -= dt;
  if ((mouse.down || keys.has(" ")) && player.cd <= 0) {
    fire();
    player.cd = player.fireRate;
  }
}

function updateSpawning(dt) {
  state.spawnTimer -= dt;
  if (state.spawned < state.target && state.spawnTimer <= 0) {
    spawnEnemy();
    state.spawnTimer = Math.max(0.18, 0.72 - state.wave * 0.045);
  }

  if (state.spawned >= state.target && enemies.length === 0) {
    completeWave();
  }
}

function updateBullets(dt) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.trail.push({ x: b.x, y: b.y });
    if (b.trail.length > 5) b.trail.shift();
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;

    const out = b.x < -30 || b.y < -30 || b.x > world.width + 30 || b.y > world.height + 30;
    if (b.life <= 0 || out) bullets.splice(i, 1);
  }
}

function updateEnemies(dt) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    const dx = player.x - e.x;
    const dy = player.y - e.y;
    const m = Math.hypot(dx, dy) || 1;
    e.x += (dx / m) * e.speed * dt;
    e.y += (dy / m) * e.speed * dt;
    e.hitTimer = Math.max(0, e.hitTimer - dt);

    if (m < e.r + player.r) {
      player.hp -= (e.elite ? 34 : 24) * dt;
      state.shake = Math.max(state.shake, 3);
      if (player.hp <= 0) {
        player.hp = 0;
        state.running = false;
        state.shake = 12;
      }
    }

    for (let j = bullets.length - 1; j >= 0; j--) {
      const b = bullets[j];
      if (Math.hypot(b.x - e.x, b.y - e.y) < b.r + e.r) {
        bullets.splice(j, 1);
        e.hp--;
        e.hitTimer = 0.1;
        addParticles(b.x, b.y, "#ff4358", 8, e.elite ? 1.15 : 0.9);
        addPopup(e.x, e.y - e.r, `${player.damage}`, "#bff7ff");

        if (e.hp <= 0) {
          addParticles(e.x, e.y, e.elite ? "#ff3656" : "#ff6b3d", e.elite ? 22 : 13, e.elite ? 1.4 : 1);
          gainRewards(e);
          addPopup(e.x, e.y, `+${e.elite ? 30 : 10}`, "#ffd13f");
          enemies.splice(i, 1);
        }
        break;
      }
    }
  }
}

function updateEffects(dt) {
  state.shake = Math.max(0, state.shake - dt * 18);
  state.flashTimer = Math.max(0, state.flashTimer - dt);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.96;
    p.vy *= 0.96;
    p.life -= dt;
    if (p.life <= 0) particles.splice(i, 1);
  }

  for (let i = popups.length - 1; i >= 0; i--) {
    const p = popups[i];
    p.y += p.vy * dt;
    p.life -= dt;
    if (p.life <= 0) popups.splice(i, 1);
  }
}

function updateHud() {
  const enemiesLeft = enemies.length + Math.max(0, state.target - state.spawned);
  hud.healthFill.style.width = pct(player.hp, player.maxHp);
  hud.healthValue.textContent = `${Math.ceil(player.hp)}/${player.maxHp}`;
  hud.levelValue.textContent = `LVL ${state.level}`;
  hud.waveValue.textContent = `Wave ${state.wave}`;
  hud.enemiesValue.textContent = `Enemies left: ${enemiesLeft}`;
  hud.currencyValue.textContent = state.currency;
  hud.scoreValue.textContent = `Score ${state.score}`;
  hud.xpFill.style.width = pct(state.xp, state.nextXp);
  hud.xpValue.textContent = `${state.xp} / ${state.nextXp}`;
  hud.objectiveText.textContent = enemiesLeft > 0 ? "Survive the wave" : "Sector secure";
  hud.objectiveCheck.style.background = enemiesLeft > 0 ? "transparent" : "rgba(40,244,111,0.45)";
  hud.damageStat.textContent = player.damage;
  hud.fireRateStat.textContent = `${(1 / player.fireRate).toFixed(1)}/s`;
  hud.speedStat.textContent = player.speed;
  hud.critStat.textContent = `${Math.round(player.critChance * 100)}%`;
  hud.maxHealthStat.textContent = player.maxHp;
}

function update(dt) {
  if (!state.running) return;
  updatePlayer(dt);
  updateSpawning(dt);
  updateBullets(dt);
  updateEnemies(dt);
  updateEffects(dt);
  updateHud();
}

function drawArena() {
  const gradient = ctx.createRadialGradient(world.width / 2, world.height / 2, 80, world.width / 2, world.height / 2, 720);
  gradient.addColorStop(0, "#0b1728");
  gradient.addColorStop(0.58, "#07101c");
  gradient.addColorStop(1, "#02050b");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, world.width, world.height);

  ctx.strokeStyle = "rgba(91, 169, 224, 0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x < world.width; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, world.height);
    ctx.stroke();
  }
  for (let y = 0; y < world.height; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(world.width, y);
    ctx.stroke();
  }

  for (let i = 0; i < 18; i++) {
    const x = (i * 191) % world.width;
    const y = (i * 113) % world.height;
    ctx.fillStyle = i % 3 === 0 ? "rgba(255, 138, 40, 0.18)" : "rgba(31, 138, 255, 0.14)";
    ctx.fillRect(x - 18, y - 12, 36, 24);
    ctx.strokeStyle = "rgba(140, 202, 255, 0.12)";
    ctx.strokeRect(x - 18, y - 12, 36, 24);
  }
}

function drawBullets() {
  ctx.lineCap = "round";
  for (const b of bullets) {
    ctx.strokeStyle = "rgba(66, 217, 255, 0.28)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    for (const [index, point] of b.trail.entries()) {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    ctx.fillStyle = "#f6fdff";
    ctx.shadowColor = "#57e7ff";
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function drawEnemies() {
  for (const e of enemies) {
    const glow = e.elite ? "#ff3656" : "#ff4054";
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.shadowColor = glow;
    ctx.shadowBlur = e.hitTimer > 0 ? 24 : 14;
    ctx.fillStyle = e.hitTimer > 0 ? "#fff" : e.elite ? "#7c1525" : "#5a1020";
    ctx.beginPath();
    ctx.arc(0, 0, e.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = glow;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, e.r * 0.36, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (e.elite && e.hp < e.maxHp) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(e.x - 18, e.y - e.r - 11, 36, 4);
      ctx.fillStyle = "#ff3656";
      ctx.fillRect(e.x - 18, e.y - e.r - 11, 36 * (e.hp / e.maxHp), 4);
    }
  }
}

function drawPlayer() {
  const dx = mouse.x - player.x;
  const dy = mouse.y - player.y;
  const m = Math.hypot(dx, dy) || 1;
  const nx = dx / m;
  const ny = dy / m;

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(Math.atan2(ny, nx));
  ctx.shadowColor = "#25dfff";
  ctx.shadowBlur = 24;
  ctx.fillStyle = "#0b89d8";
  ctx.beginPath();
  ctx.arc(0, 0, player.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#d9fbff";
  ctx.fillRect(4, -4, 27, 8);
  ctx.fillStyle = "#42eaff";
  ctx.beginPath();
  ctx.arc(-4, 0, 7, 0, Math.PI * 2);
  ctx.fill();
  if (state.flashTimer > 0) {
    ctx.fillStyle = "#ffe26a";
    ctx.beginPath();
    ctx.moveTo(31, 0);
    ctx.lineTo(51, -8);
    ctx.lineTo(48, 0);
    ctx.lineTo(51, 8);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  ctx.strokeStyle = "rgba(87, 231, 255, 0.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r + 12, 0, Math.PI * 2);
  ctx.stroke();
}

function drawEffects() {
  for (const p of particles) {
    ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  ctx.textAlign = "center";
  ctx.font = "900 18px Trebuchet MS";
  for (const p of popups) {
    ctx.globalAlpha = clamp(p.life / 0.85, 0, 1);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, p.x, p.y);
  }
  ctx.globalAlpha = 1;
}

function drawGameOver() {
  if (state.running) return;
  ctx.fillStyle = "rgba(0, 0, 0, 0.58)";
  ctx.fillRect(0, 0, world.width, world.height);
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 54px Trebuchet MS";
  ctx.fillText("Breach Failed", world.width / 2, world.height / 2 - 12);
  ctx.fillStyle = "#57e7ff";
  ctx.font = "900 22px Trebuchet MS";
  ctx.fillText("Press R to restart", world.width / 2, world.height / 2 + 32);
}

function renderRadar() {
  const w = radar.width;
  const h = radar.height;
  radarCtx.clearRect(0, 0, w, h);
  for (const e of enemies) {
    const rx = w / 2 + ((e.x - player.x) / world.width) * 130;
    const ry = h / 2 + ((e.y - player.y) / world.height) * 96;
    if (rx < 12 || ry < 12 || rx > w - 12 || ry > h - 12) continue;
    radarCtx.shadowColor = e.elite ? "#ff3656" : "#ff4054";
    radarCtx.shadowBlur = 8;
    radarCtx.fillStyle = e.elite ? "#ff3656" : "#ff4054";
    radarCtx.beginPath();
    radarCtx.arc(rx, ry, e.elite ? 4 : 3, 0, Math.PI * 2);
    radarCtx.fill();
  }
  radarCtx.shadowBlur = 0;
}

function render() {
  ctx.save();
  if (state.shake > 0) {
    ctx.translate(rand(-state.shake, state.shake), rand(-state.shake, state.shake));
  }
  drawArena();
  drawBullets();
  drawEnemies();
  drawPlayer();
  drawEffects();
  drawGameOver();
  ctx.restore();
  renderRadar();
}

function reset() {
  Object.assign(state, {
    running: true,
    score: 0,
    currency: 0,
    wave: 1,
    level: 1,
    xp: 0,
    nextXp: 100,
    spawnTimer: 0,
    spawned: 0,
    target: 10,
    shake: 0,
    flashTimer: 0,
  });
  player.x = world.width / 2;
  player.y = world.height / 2;
  player.hp = player.maxHp;
  player.cd = 0;
  player.damage = 25;
  bullets.length = 0;
  enemies.length = 0;
  particles.length = 0;
  popups.length = 0;
  updateHud();
}

function frame(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;
  update(dt);
  render();
  requestAnimationFrame(frame);
}

window.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  keys.add(k);
  if (k === "r" && !state.running) reset();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
});

window.addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));

canvas.addEventListener("mousemove", (e) => {
  const r = canvas.getBoundingClientRect();
  mouse.x = (e.clientX - r.left) * (world.width / r.width);
  mouse.y = (e.clientY - r.top) * (world.height / r.height);
});

canvas.addEventListener("mousedown", (e) => {
  if (e.button === 0) mouse.down = true;
});

window.addEventListener("mouseup", () => {
  mouse.down = false;
});

setupHud();
updateHud();
requestAnimationFrame(frame);
