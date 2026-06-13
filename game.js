const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const radar = document.getElementById("radar");
const radarCtx = radar.getContext("2d");
const playerSprite = new Image();
const pilotSelectEl = document.getElementById("pilotSelect");
const confirmPilotEl = document.getElementById("confirmPilot");
const pilotCardListEl = document.getElementById("pilotCardList");
const orientationGuardEl = document.getElementById("orientationGuard");

function assetUrl(path) {
  return new URL(path.replace(/^\//, ""), window.location.href).toString();
}

playerSprite.src = assetUrl("assets/player/player-avatar-sprite.png");

function loadImage(src) {
  const image = new Image();
  image.src = assetUrl(src);
  return image;
}

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

const pilots = [
  {
    name: "Vanguard",
    portrait: assetUrl("assets/player/portraits/pilot-vanguard.PNG"),
    role: "Balanced starter",
    maxHpBonus: 0,
    speedBonus: 0,
    damageBonus: 0,
  },
  {
    name: "Sentinel",
    portrait: assetUrl("assets/player/portraits/pilot-sentinel.PNG"),
    role: "Armored trooper",
    maxHpBonus: 25,
    speedBonus: -18,
    damageBonus: 0,
  },
  {
    name: "Reaper",
    portrait: assetUrl("assets/player/portraits/pilot-reaper.PNG"),
    role: "High-risk hunter",
    maxHpBonus: -10,
    speedBonus: 16,
    damageBonus: 5,
  },
  {
    name: "Striker",
    portrait: assetUrl("assets/player/portraits/pilot-striker.PNG"),
    role: "Fast reload",
    maxHpBonus: 0,
    speedBonus: 8,
    damageBonus: 2,
  },
  {
    name: "Hunter",
    portrait: assetUrl("assets/player/portraits/pilot-hunter.PNG"),
    role: "Close combat",
    maxHpBonus: 15,
    speedBonus: -6,
    damageBonus: 4,
  },
  {
    name: "Prowler",
    portrait: assetUrl("assets/player/portraits/pilot-prowler.PNG"),
    role: "High mobility",
    maxHpBonus: -5,
    speedBonus: 28,
    damageBonus: 1,
  },
  {
    name: "Wraith",
    portrait: assetUrl("assets/player/portraits/pilot-wraith.PNG"),
    role: "Heavy damage",
    maxHpBonus: 5,
    speedBonus: -10,
    damageBonus: 8,
  },
  {
    name: "Nova",
    portrait: assetUrl("assets/player/portraits/pilot-nova.png"),
    role: "Speed caster",
    maxHpBonus: -8,
    speedBonus: 22,
    damageBonus: 3,
  },
  {
    name: "Idol",
    portrait: assetUrl("assets/player/portraits/idol.png"),
    role: "Stable carry",
    maxHpBonus: 10,
    speedBonus: 6,
    damageBonus: 2,
  },
  {
    name: "Flux",
    portrait: assetUrl("assets/player/portraits/pilot-flux.png"),
    role: "Evasive scout",
    maxHpBonus: -12,
    speedBonus: 34,
    damageBonus: 2,
  },
  {
    name: "Cipher",
    portrait: assetUrl("assets/player/portraits/pilot-cipher.PNG"),
    role: "Crit specialist",
    maxHpBonus: 0,
    speedBonus: 12,
    damageBonus: 6,
  },
  {
    name: "Aegis",
    portrait: assetUrl("assets/player/portraits/pilot-aegis.PNG"),
    role: "Heavy armor",
    maxHpBonus: 35,
    speedBonus: -24,
    damageBonus: 3,
  },
];

const keys = new Set();
const mouse = { x: canvas.width / 2, y: canvas.height / 2, down: false };
const world = { width: 1280, height: 720 };

const WEAPONS = {
  pistol: {
    name: "Pistol",
    damage: 12,
    fireRate: 0.22,
    projectileSpeed: 620,
    spread: 0,
    projectileCount: 1,
    pierce: 0,
    knockback: 60,
    reloadTime: 0,
    magazineSize: Infinity,
    critChance: 0.08,
    critMultiplier: 1.75,
    description: "Balanced starter weapon.",
    icon: assetUrl("assets/ui/icons/weapons/pistol.png"),
    projectileRadius: 4,
    projectileLife: 1,
    color: "#f6fdff",
    trailColor: "rgba(87, 231, 255, 0.3)",
    recoil: 2,
    uiPips: 6,
  },
  shotgun: {
    name: "Shotgun",
    damage: 7,
    fireRate: 0.75,
    projectileSpeed: 520,
    spread: 0.45,
    projectileCount: 6,
    pierce: 0,
    knockback: 120,
    reloadTime: 0,
    magazineSize: Infinity,
    critChance: 0.05,
    critMultiplier: 1.5,
    description: "Close-range burst weapon.",
    icon: assetUrl("assets/ui/icons/weapons/shotgun.png"),
    projectileRadius: 3.5,
    projectileLife: 0.42,
    color: "#aef8ff",
    trailColor: "rgba(87, 231, 255, 0.22)",
    recoil: 5,
    uiPips: 5,
  },
  laser: {
    name: "Laser",
    damage: 5,
    fireRate: 0.08,
    projectileSpeed: 900,
    spread: 0,
    projectileCount: 1,
    pierce: 4,
    knockback: 20,
    reloadTime: 0,
    magazineSize: Infinity,
    critChance: 0.12,
    critMultiplier: 1.6,
    description: "Fast piercing energy weapon.",
    icon: assetUrl("assets/ui/icons/weapons/laser.png"),
    projectileRadius: 3,
    projectileLife: 0.58,
    color: "#47a8ff",
    trailColor: "rgba(36, 169, 255, 0.42)",
    recoil: 1,
    uiPips: 4,
  },
  rocket: {
    name: "Rocket Launcher",
    damage: 35,
    fireRate: 1.25,
    projectileSpeed: 360,
    spread: 0,
    projectileCount: 1,
    pierce: 0,
    knockback: 180,
    explosionRadius: 90,
    splashDamage: 22,
    reloadTime: 0,
    magazineSize: Infinity,
    critChance: 0.04,
    critMultiplier: 2,
    description: "Slow explosive heavy weapon.",
    icon: assetUrl("assets/ui/icons/weapons/rocket_launcher.png"),
    projectileRadius: 9,
    projectileLife: 1.65,
    color: "#ffec8a",
    trailColor: "rgba(255, 85, 54, 0.42)",
    recoil: 12,
    uiPips: 3,
  },
};

const weaponOrder = ["pistol", "shotgun", "laser", "rocket"];

const enemySprites = {
  runner: loadImage("assets/enermy/runner.png"),
  tank: loadImage("assets/enermy/tank.png"),
  shooter: loadImage("assets/enermy/shooter.png"),
  exploder: loadImage("assets/enermy/Exploder.png"),
};

const enemyTypes = {
  runner: {
    name: "Runner",
    sprite: enemySprites.runner,
    radius: 14,
    size: 58,
    hp: 24,
    speed: 148,
    contactDps: 24,
    score: 10,
    currency: 3,
    xp: 12,
    color: "#ff4054",
    unlockWave: 1,
    weight: 7,
  },
  tank: {
    name: "Tank",
    sprite: enemySprites.tank,
    radius: 23,
    size: 86,
    hp: 98,
    speed: 56,
    contactDps: 38,
    score: 22,
    currency: 5,
    xp: 20,
    color: "#ff6540",
    unlockWave: 2,
    weight: 3,
  },
  shooter: {
    name: "Shooter",
    sprite: enemySprites.shooter,
    radius: 17,
    size: 68,
    hp: 46,
    speed: 82,
    contactDps: 18,
    desiredRange: 260,
    shotCooldown: 1.45,
    shotDamage: 13,
    shotSpeed: 315,
    score: 18,
    currency: 4,
    xp: 18,
    color: "#ff2f65",
    unlockWave: 3,
    weight: 4,
  },
  exploder: {
    name: "Exploder",
    sprite: enemySprites.exploder,
    radius: 18,
    size: 72,
    hp: 34,
    speed: 116,
    contactDps: 10,
    explodeRadius: 88,
    explodeDamage: 38,
    score: 16,
    currency: 4,
    xp: 16,
    color: "#ff3656",
    unlockWave: 4,
    weight: 3,
  },
};

const perks = [
  { name: "Rapid Fire", icon: assetUrl("assets/ui/icons/perks/rapid_fire.png") },
  { name: "Max Health", icon: assetUrl("assets/ui/icons/perks/max_health.png") },
  { name: "Speed Boost", icon: assetUrl("assets/ui/icons/perks/speed_boost.png") },
  { name: "Piercing", icon: assetUrl("assets/ui/icons/perks/piercing.png") },
  { name: "Regen", icon: assetUrl("assets/ui/icons/perks/regeneration.png") },
  { name: "Crit Damage", icon: assetUrl("assets/ui/icons/perks/crit_damage.png") },
];

const state = {
  running: false,
  choosingPilot: true,
  orientationBlocked: false,
  selectedPilot: 0,
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
  baseSpeed: 270,
  maxHp: 100,
  baseMaxHp: 100,
  hp: 100,
  cd: 0,
  damageBonus: 0,
  baseDamageBonus: 0,
  critChance: 0.15,
};

const bullets = [];
const enemyBullets = [];
const enemies = [];
const particles = [];
const shockwaves = [];
const popups = [];
let last = performance.now();

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => Math.random() * (b - a) + a;
const pct = (value, max) => `${clamp((value / max) * 100, 0, 100)}%`;
const activeWeapon = () => ({ id: weaponOrder[state.activeWeapon], ...WEAPONS[weaponOrder[state.activeWeapon]] });
const weaponDamage = (weapon) => weapon.damage + player.damageBonus;
const weaponCritChance = (weapon) => clamp(weapon.critChance + player.critChance, 0, 1);
const weaponDisplayList = () => weaponOrder.map((id) => ({ id, ...WEAPONS[id] }));

function isPhonePortraitBlocked() {
  const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const isPhoneSized = Math.max(window.innerWidth, window.innerHeight) <= 980;
  return isTouchDevice && isPhoneSized && window.innerHeight > window.innerWidth;
}

function updateOrientationGuard() {
  state.orientationBlocked = isPhonePortraitBlocked();
  orientationGuardEl?.classList.toggle("hidden", !state.orientationBlocked);
  if (state.orientationBlocked) mouse.down = false;
}

function applyPilot(index) {
  const pilot = pilots[index];
  state.selectedPilot = index;
  player.maxHp = player.baseMaxHp + pilot.maxHpBonus;
  player.speed = player.baseSpeed + pilot.speedBonus;
  player.damageBonus = player.baseDamageBonus + pilot.damageBonus;
  player.hp = player.maxHp;
  const avatar = document.querySelector(".avatar-core");
  if (avatar) avatar.src = pilot.portrait;
}

function selectPilot(index) {
  if (index < 0 || index >= pilots.length) return;
  applyPilot(index);
  document.querySelectorAll(".pilot-card").forEach((card) => {
    card.classList.toggle("active", Number(card.dataset.pilotIndex) === index);
  });
  updateHud();
}

function deployPilot() {
  state.choosingPilot = false;
  state.running = true;
  pilotSelectEl?.classList.add("hidden");
  addPopup(player.x, player.y - 40, pilots[state.selectedPilot].name, "#57e7ff");
  updateHud();
}

function setupHud() {
  const weaponList = weaponDisplayList();
  hud.weaponList.innerHTML = weaponList.map((weapon, index) => `
    <button class="weapon-row ${index === state.activeWeapon ? "active" : ""}" type="button" data-weapon-index="${index}">
      <span class="weapon-slot">${index + 1}</span>
      <img class="weapon-icon" src="${weapon.icon}" alt="" aria-hidden="true">
      <span>
        <span class="weapon-name">${weapon.name}</span>
        <span class="ammo-pips">${Array.from({ length: 7 }, (_, pip) => (
          `<span class="${pip < weapon.uiPips ? "filled" : ""}"></span>`
        )).join("")}</span>
      </span>
    </button>
  `).join("");

  hud.weaponList.querySelectorAll("[data-weapon-index]").forEach((row) => {
    row.addEventListener("click", () => selectWeapon(Number(row.dataset.weaponIndex)));
  });

  hud.perkList.innerHTML = perks.map((perk) => `
    <div class="perk-card">
      <img class="perk-icon" src="${perk.icon}" alt="" aria-hidden="true">
      <span class="perk-name">${perk.name}</span>
    </div>
  `).join("");
}

function renderPilotCards() {
  if (!pilotCardListEl) return;
  pilotCardListEl.innerHTML = pilots.map((pilot, index) => `
    <button class="pilot-card ${index === state.selectedPilot ? "active" : ""}" type="button" data-pilot-index="${index}">
      <img src="${pilot.portrait}" alt="" aria-hidden="true">
      <strong>${pilot.name}</strong>
      <span>${pilot.role}</span>
    </button>
  `).join("");
}

function setupPilotSelect() {
  renderPilotCards();
  document.querySelectorAll(".pilot-card").forEach((card) => {
    card.addEventListener("click", () => selectPilot(Number(card.dataset.pilotIndex)));
  });
  confirmPilotEl?.addEventListener("click", deployPilot);
  selectPilot(state.selectedPilot);
}

function pickEnemyType() {
  const available = Object.entries(enemyTypes).filter(([, type]) => state.wave >= type.unlockWave);
  const totalWeight = available.reduce((sum, [, type]) => sum + type.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const [id, type] of available) {
    roll -= type.weight;
    if (roll <= 0) return { id, type };
  }
  return { id: "runner", type: enemyTypes.runner };
}

function spawnEnemy() {
  const side = Math.floor(Math.random() * 4);
  let x = 0;
  let y = 0;

  if (side === 0) { x = rand(0, world.width); y = -24; }
  if (side === 1) { x = world.width + 24; y = rand(0, world.height); }
  if (side === 2) { x = rand(0, world.width); y = world.height + 24; }
  if (side === 3) { x = -24; y = rand(0, world.height); }

  const { id, type } = pickEnemyType();
  const elite = state.wave % 3 === 0 && Math.random() < 0.22;
  const hp = type.hp + state.wave * 7 + (elite ? type.hp * 0.75 : 0);
  const speed = type.speed + state.wave * 4 - (elite ? 12 : 0);
  enemies.push({
    x,
    y,
    type: id,
    name: type.name,
    sprite: type.sprite,
    r: type.radius + (elite ? 4 : 0),
    drawSize: type.size * (elite ? 1.15 : 1),
    speed,
    hp,
    maxHp: hp,
    contactDps: type.contactDps,
    desiredRange: type.desiredRange || 0,
    shotCooldown: type.shotCooldown || 0,
    shotTimer: rand(0.35, type.shotCooldown || 1.2),
    shotDamage: type.shotDamage || 0,
    shotSpeed: type.shotSpeed || 0,
    explodeRadius: type.explodeRadius || 0,
    explodeDamage: type.explodeDamage || 0,
    scoreValue: type.score,
    currencyValue: type.currency,
    xpValue: type.xp,
    color: type.color,
    elite,
    hitTimer: 0,
    angle: 0,
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

function addShockwave(x, y, radius, color = "#ffb13d", life = 0.38) {
  shockwaves.push({
    x,
    y,
    radius: 8,
    maxRadius: radius,
    color,
    life,
    maxLife: life,
  });
}

function selectWeapon(index) {
  if (index < 0 || index >= weaponOrder.length || state.activeWeapon === index) return;
  state.activeWeapon = index;
  player.cd = Math.min(player.cd, 0.08);
  setupHud();
  updateHud();
  addPopup(player.x, player.y - 34, activeWeapon().name, "#57e7ff");
}

function spawnProjectile(weapon, nx, ny, angleOffset = 0) {
  const angle = Math.atan2(ny, nx) + angleOffset;
  const vx = Math.cos(angle) * weapon.projectileSpeed;
  const vy = Math.sin(angle) * weapon.projectileSpeed;
  const crit = Math.random() < weaponCritChance(weapon);
  bullets.push({
    x: player.x + Math.cos(angle) * 20,
    y: player.y + Math.sin(angle) * 20,
    vx,
    vy,
    r: weapon.projectileRadius,
    life: weapon.projectileLife,
    damage: weaponDamage(weapon) * (crit ? weapon.critMultiplier : 1),
    crit,
    pierceLeft: weapon.pierce,
    knockback: weapon.knockback || 0,
    splashRadius: weapon.explosionRadius || 0,
    splashDamage: weapon.splashDamage || 0,
    color: weapon.color,
    trailColor: weapon.trailColor,
    kind: weapon.id,
    trail: [],
    hitEnemies: new Set(),
  });
}

function fire() {
  const weapon = activeWeapon();
  const dx = mouse.x - player.x;
  const dy = mouse.y - player.y;
  const m = Math.hypot(dx, dy) || 1;
  const nx = dx / m;
  const ny = dy / m;

  const projectileCount = weapon.projectileCount || 1;
  const firstOffset = projectileCount === 1 ? 0 : -weapon.spread / 2;
  const step = projectileCount === 1 ? 0 : weapon.spread / (projectileCount - 1);
  for (let i = 0; i < projectileCount; i++) {
    const randomSpread = weapon.spread === 0 ? 0 : rand(-0.018, 0.018);
    spawnProjectile(weapon, nx, ny, firstOffset + step * i + randomSpread);
  }

  state.flashTimer = 0.07;
  state.shake = Math.max(state.shake, weapon.recoil);
  addParticles(player.x + nx * 24, player.y + ny * 24, weapon.color, projectileCount > 1 ? 12 : 6, 0.8);
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
  state.score += Math.round(enemy.scoreValue * (enemy.elite ? 1.7 : 1));
  state.currency += Math.round(enemy.currencyValue * (enemy.elite ? 1.5 : 1));
  state.xp += Math.round(enemy.xpValue * (enemy.elite ? 1.6 : 1));

  if (state.xp >= state.nextXp) {
    state.xp -= state.nextXp;
    state.level++;
    state.nextXp += 50;
    player.damageBonus += 3;
    player.hp = clamp(player.hp + 18, 0, player.maxHp);
    addPopup(player.x, player.y - 48, "Level Up", "#ffd13f");
    state.shake = 7;
  }
}

function damageEnemy(enemy, amount, hitX, hitY, popupColor = "#bff7ff") {
  enemy.hp -= amount;
  enemy.hitTimer = 0.1;
  addParticles(hitX, hitY, enemy.color || "#ff4358", enemy.elite ? 10 : 7, enemy.elite ? 1.15 : 0.9);
  addPopup(enemy.x, enemy.y - enemy.r, `${Math.round(amount)}`, popupColor);
  return enemy.hp <= 0;
}

function killEnemy(index) {
  const enemy = enemies[index];
  addParticles(enemy.x, enemy.y, enemy.elite ? "#ff3656" : enemy.color, enemy.elite ? 22 : 13, enemy.elite ? 1.4 : 1);
  gainRewards(enemy);
  addPopup(enemy.x, enemy.y, `+${Math.round(enemy.scoreValue * (enemy.elite ? 1.7 : 1))}`, "#ffd13f");
  enemies.splice(index, 1);
}

function detonateProjectile(bullet) {
  if (!bullet.splashRadius) return;
  state.shake = Math.max(state.shake, bullet.kind === "rocket" ? 14 : 7);
  addShockwave(bullet.x, bullet.y, bullet.splashRadius, bullet.kind === "rocket" ? "#ffb13d" : "#ff6b3d");
  addParticles(bullet.x, bullet.y, "#ffb13d", bullet.kind === "rocket" ? 58 : 30, bullet.kind === "rocket" ? 1.85 : 1.35);
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    const distance = Math.hypot(e.x - bullet.x, e.y - bullet.y);
    if (distance > bullet.splashRadius + e.r) continue;
    const falloff = 1 - clamp(distance / bullet.splashRadius, 0, 0.75);
    if (damageEnemy(e, bullet.splashDamage * falloff, bullet.x, bullet.y, "#ffd13f")) {
      killEnemy(i);
    }
  }
}

function applyKnockback(enemy, bullet) {
  if (!bullet.knockback) return;
  const speed = Math.hypot(bullet.vx, bullet.vy) || 1;
  const push = bullet.knockback / Math.max(enemy.r, 12);
  enemy.x = clamp(enemy.x + (bullet.vx / speed) * push, enemy.r, world.width - enemy.r);
  enemy.y = clamp(enemy.y + (bullet.vy / speed) * push, enemy.r, world.height - enemy.r);
}

function explodeEnemy(index) {
  const enemy = enemies[index];
  const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
  if (distance <= enemy.explodeRadius + player.r) {
    const falloff = 1 - clamp(distance / enemy.explodeRadius, 0, 0.72);
    player.hp = Math.max(0, player.hp - enemy.explodeDamage * falloff);
    if (player.hp <= 0) state.running = false;
  }
  state.shake = Math.max(state.shake, 10);
  addShockwave(enemy.x, enemy.y, enemy.explodeRadius, "#ff3656", 0.34);
  addParticles(enemy.x, enemy.y, "#ff3656", 34, 1.45);
  enemies.splice(index, 1);
}

function fireEnemyShot(enemy, dx, dy, distance) {
  const nx = dx / distance;
  const ny = dy / distance;
  enemyBullets.push({
    x: enemy.x + nx * (enemy.r + 8),
    y: enemy.y + ny * (enemy.r + 8),
    vx: nx * enemy.shotSpeed,
    vy: ny * enemy.shotSpeed,
    r: enemy.elite ? 7 : 5,
    life: 2.2,
    damage: enemy.shotDamage * (enemy.elite ? 1.35 : 1),
    color: enemy.elite ? "#ff2f65" : "#ff4a3d",
    trailColor: enemy.elite ? "rgba(255, 47, 101, 0.45)" : "rgba(255, 72, 61, 0.38)",
    trail: [],
  });
  addParticles(enemy.x + nx * enemy.r, enemy.y + ny * enemy.r, "#ff4054", enemy.elite ? 7 : 4, 0.7);
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
    player.cd = activeWeapon().fireRate;
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
    if (b.life <= 0 || out) {
      if (b.splashRadius && !out) detonateProjectile(b);
      bullets.splice(i, 1);
    }
  }
}

function updateEnemyBullets(dt) {
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    b.trail.push({ x: b.x, y: b.y });
    if (b.trail.length > 7) b.trail.shift();
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;

    const out = b.x < -40 || b.y < -40 || b.x > world.width + 40 || b.y > world.height + 40;
    if (b.life <= 0 || out) {
      enemyBullets.splice(i, 1);
      continue;
    }

    if (Math.hypot(b.x - player.x, b.y - player.y) < b.r + player.r) {
      player.hp = Math.max(0, player.hp - b.damage);
      state.shake = Math.max(state.shake, 6);
      addParticles(b.x, b.y, b.color, 12, 1);
      enemyBullets.splice(i, 1);
      if (player.hp <= 0) {
        state.running = false;
        state.shake = 12;
      }
    }
  }
}

function updateEnemies(dt) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    const dx = player.x - e.x;
    const dy = player.y - e.y;
    const m = Math.hypot(dx, dy) || 1;
    const nx = dx / m;
    const ny = dy / m;
    e.angle = Math.atan2(ny, nx);

    let moveX = nx;
    let moveY = ny;
    if (e.type === "shooter") {
      if (m < e.desiredRange * 0.68) {
        moveX = -nx;
        moveY = -ny;
      } else if (m < e.desiredRange) {
        moveX = -ny * 0.65;
        moveY = nx * 0.65;
      }
      e.shotTimer -= dt;
      if (e.shotTimer <= 0 && m < e.desiredRange * 1.22) {
        fireEnemyShot(e, dx, dy, m);
        e.shotTimer = e.shotCooldown * rand(0.82, 1.18);
      }
    }

    e.x = clamp(e.x + moveX * e.speed * dt, e.r, world.width - e.r);
    e.y = clamp(e.y + moveY * e.speed * dt, e.r, world.height - e.r);
    e.hitTimer = Math.max(0, e.hitTimer - dt);

    if (e.type === "exploder" && m < e.explodeRadius * 0.46 + player.r) {
      explodeEnemy(i);
      continue;
    }

    if (m < e.r + player.r) {
      player.hp -= e.contactDps * (e.elite ? 1.35 : 1) * dt;
      state.shake = Math.max(state.shake, 3);
      if (player.hp <= 0) {
        player.hp = 0;
        state.running = false;
        state.shake = 12;
      }
    }

    for (let j = bullets.length - 1; j >= 0; j--) {
      const b = bullets[j];
      if (b.hitEnemies.has(e)) continue;
      if (Math.hypot(b.x - e.x, b.y - e.y) < b.r + e.r) {
        b.hitEnemies.add(e);
        applyKnockback(e, b);
        const dead = damageEnemy(e, b.damage, b.x, b.y, b.crit ? "#ffd13f" : "#bff7ff");
        if (b.splashRadius) detonateProjectile(b);
        if (dead && enemies[i] === e) killEnemy(i);
        if (b.pierceLeft > 0 && !b.splashRadius) {
          b.pierceLeft--;
        } else {
          bullets.splice(j, 1);
        }
        break;
      }
    }
  }
}

function updateEffects(dt) {
  state.shake = Math.max(0, state.shake - dt * 18);
  state.flashTimer = Math.max(0, state.flashTimer - dt);

  for (let i = shockwaves.length - 1; i >= 0; i--) {
    const wave = shockwaves[i];
    wave.life -= dt;
    const progress = 1 - wave.life / wave.maxLife;
    wave.radius = wave.maxRadius * clamp(progress, 0, 1);
    if (wave.life <= 0) shockwaves.splice(i, 1);
  }

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
  hud.damageStat.textContent = weaponDamage(activeWeapon());
  hud.fireRateStat.textContent = `${(1 / activeWeapon().fireRate).toFixed(1)}/s`;
  hud.speedStat.textContent = player.speed;
  hud.critStat.textContent = `${Math.round(weaponCritChance(activeWeapon()) * 100)}%`;
  hud.maxHealthStat.textContent = player.maxHp;
}

function update(dt) {
  if (!state.running || state.orientationBlocked) return;
  updatePlayer(dt);
  updateSpawning(dt);
  updateBullets(dt);
  updateEnemyBullets(dt);
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

function drawPlayerProjectileIcon(b) {
  const angle = Math.atan2(b.vy, b.vx);
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(angle);
  ctx.shadowColor = b.color || "#57e7ff";

  if (b.kind === "rocket") {
    ctx.shadowBlur = 26;
    ctx.fillStyle = "#ffec8a";
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(3, -8);
    ctx.lineTo(-13, -6);
    ctx.lineTo(-17, 0);
    ctx.lineTo(-13, 6);
    ctx.lineTo(3, 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ff5638";
    ctx.beginPath();
    ctx.moveTo(-15, -5);
    ctx.lineTo(-30, 0);
    ctx.lineTo(-15, 5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#fff2af";
    ctx.lineWidth = 2;
    ctx.strokeRect(-5, -4, 10, 8);
  } else if (b.kind === "laser") {
    ctx.shadowBlur = 24;
    ctx.fillStyle = "#67dfff";
    ctx.beginPath();
    ctx.moveTo(19, 0);
    ctx.lineTo(4, -5);
    ctx.lineTo(-18, -3);
    ctx.lineTo(-22, 0);
    ctx.lineTo(-18, 3);
    ctx.lineTo(4, 5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#dffbff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(15, 0);
    ctx.stroke();
  } else if (b.kind === "shotgun") {
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#aef8ff";
    ctx.beginPath();
    ctx.roundRect(-4, -3, 10, 6, 3);
    ctx.fill();
  } else {
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#f6fdff";
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-6, -5);
    ctx.lineTo(-3, 0);
    ctx.lineTo(-6, 5);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawBullets() {
  ctx.lineCap = "round";
  for (const b of bullets) {
    ctx.strokeStyle = b.trailColor || "rgba(66, 217, 255, 0.28)";
    ctx.lineWidth = b.kind === "rocket" ? 11 : b.kind === "laser" ? 6 : 8;
    ctx.beginPath();
    for (const [index, point] of b.trail.entries()) {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    drawPlayerProjectileIcon(b);
    ctx.shadowBlur = 0;
  }
}

function drawEnemyBullets() {
  ctx.lineCap = "round";
  for (const b of enemyBullets) {
    ctx.strokeStyle = b.trailColor;
    ctx.lineWidth = 7;
    ctx.beginPath();
    for (const [index, point] of b.trail.entries()) {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    const angle = Math.atan2(b.vy, b.vx);
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(angle);
    ctx.shadowColor = b.color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(-7, -7);
    ctx.lineTo(-3, 0);
    ctx.lineTo(-7, 7);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffd0d0";
    ctx.beginPath();
    ctx.arc(2, 0, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.shadowBlur = 0;
}

function drawEnemies() {
  for (const e of enemies) {
    const glow = e.elite ? "#ff3656" : e.color;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    if (e.sprite.complete && e.sprite.naturalWidth > 0) {
      if (e.type === "runner" || e.type === "shooter") ctx.rotate(e.angle);
      ctx.globalAlpha = e.hitTimer > 0 ? 0.65 : 1;
      ctx.drawImage(e.sprite, -e.drawSize / 2, -e.drawSize / 2, e.drawSize, e.drawSize);
      ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = e.hitTimer > 0 ? "#fff" : e.elite ? "#7c1525" : "#5a1020";
      ctx.beginPath();
      ctx.arc(0, 0, e.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = glow;
    ctx.lineWidth = e.elite ? 3 : 2;
    ctx.beginPath();
    ctx.arc(0, 0, e.r + 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    if (e.hp < e.maxHp) {
      const barWidth = e.elite ? 46 : 34;
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(e.x - barWidth / 2, e.y - e.r - 17, barWidth, 4);
      ctx.fillStyle = glow;
      ctx.fillRect(e.x - barWidth / 2, e.y - e.r - 17, barWidth * (e.hp / e.maxHp), 4);
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
  if (playerSprite.complete && playerSprite.naturalWidth > 0) {
    ctx.shadowColor = "#25dfff";
    ctx.shadowBlur = 18;
    ctx.drawImage(playerSprite, -39, -43, 82, 82);
  } else {
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
  }
  if (state.flashTimer > 0) {
    ctx.fillStyle = "#ffe26a";
    ctx.beginPath();
    ctx.moveTo(36, 0);
    ctx.lineTo(60, -9);
    ctx.lineTo(55, 0);
    ctx.lineTo(60, 9);
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
  for (const wave of shockwaves) {
    const alpha = clamp(wave.life / wave.maxLife, 0, 1);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = wave.color;
    ctx.shadowColor = wave.color;
    ctx.shadowBlur = 22;
    ctx.lineWidth = 4 + alpha * 7;
    ctx.beginPath();
    ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

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
    radarCtx.shadowColor = "transparent";
    radarCtx.shadowBlur = 0;
    radarCtx.fillStyle = e.elite ? "#ff3656" : e.color;
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
  drawEnemyBullets();
  drawEnemies();
  drawPlayer();
  drawEffects();
  drawGameOver();
  ctx.restore();
  renderRadar();
}

function reset() {
  Object.assign(state, {
    running: false,
    choosingPilot: true,
    orientationBlocked: false,
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
  });
  player.x = world.width / 2;
  player.y = world.height / 2;
  player.cd = 0;
  applyPilot(state.selectedPilot);
  bullets.length = 0;
  enemyBullets.length = 0;
  enemies.length = 0;
  particles.length = 0;
  shockwaves.length = 0;
  popups.length = 0;
  setupHud();
  pilotSelectEl?.classList.remove("hidden");
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
  if (["1", "2", "3", "4"].includes(k)) selectWeapon(Number(k) - 1);
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

window.addEventListener("resize", updateOrientationGuard);
window.addEventListener("orientationchange", updateOrientationGuard);

function renderGameToText() {
  return JSON.stringify({
    coordinates: "origin top-left, x right, y down",
    running: state.running,
    choosingPilot: state.choosingPilot,
    wave: state.wave,
    enemiesLeft: enemies.length + Math.max(0, state.target - state.spawned),
    activeWeapon: activeWeapon().id,
    player: {
      x: Math.round(player.x),
      y: Math.round(player.y),
      hp: Math.round(player.hp),
      maxHp: player.maxHp,
    },
    enemies: enemies.slice(0, 8).map((enemy) => ({
      type: enemy.type,
      x: Math.round(enemy.x),
      y: Math.round(enemy.y),
      hp: Math.round(enemy.hp),
    })),
    playerBullets: bullets.length,
    enemyBullets: enemyBullets.length,
    score: state.score,
  });
}

window.render_game_to_text = renderGameToText;
window.advanceTime = (ms) => {
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  for (let i = 0; i < steps; i++) update(1 / 60);
  render();
};

setupHud();
setupPilotSelect();
updateOrientationGuard();
updateHud();
requestAnimationFrame(frame);
