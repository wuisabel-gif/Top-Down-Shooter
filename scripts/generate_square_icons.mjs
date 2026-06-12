import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { spawnSync } from "node:child_process";

const size = 512;
const outRoot = "assets/ui/icons";

const colors = {
  cyan: "#57e7ff",
  blue: "#168cff",
  navy: "#07192e",
  dark: "#020711",
  red: "#ff3656",
  green: "#28f46f",
  gold: "#ffd13f",
  purple: "#a66bff",
  white: "#eef7ff",
};

function ensure(path) {
  mkdirSync(dirname(path), { recursive: true });
}

function svgShell(body, accent = colors.cyan, glow = accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.22"/>
      <stop offset="58%" stop-color="${colors.navy}" stop-opacity="0.86"/>
      <stop offset="100%" stop-color="${colors.dark}" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <linearGradient id="metal" x1="20%" y1="10%" x2="80%" y2="90%">
      <stop offset="0%" stop-color="${colors.white}"/>
      <stop offset="44%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${colors.blue}"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="none"/>
  <circle cx="256" cy="256" r="216" fill="url(#bg)"/>
  <path d="M128 62h256l92 194-92 194H128L36 256z" fill="rgba(2,7,17,0.72)" stroke="${glow}" stroke-width="8" filter="url(#glow)"/>
  <path d="M151 105h210l70 151-70 151H151L81 256z" fill="none" stroke="${glow}" stroke-opacity="0.38" stroke-width="3"/>
  ${body}
</svg>`;
}

function perkBody(type, accent) {
  const common = `stroke="${accent}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#glow)"`;
  const fill = `fill="url(#metal)" filter="url(#glow)"`;
  const variants = {
    rapid_fire: `<g ${common}><path d="M180 166v180"/><path d="M238 136v240"/><path d="M296 136v240"/><path d="M354 166v180"/></g><path d="M152 256h208" ${common}/>`,
    max_health: `<path d="M256 382C159 308 120 250 130 197c8-43 45-70 88-56 19 6 31 20 38 33 7-13 19-27 38-33 43-14 80 13 88 56 10 53-29 111-126 185z" ${fill}/>` ,
    speed_boost: `<g ${common}><path d="M142 196h126l-56 62h118"/><path d="M198 316h164"/><path d="M304 160l76 96-76 96"/></g>`,
    piercing: `<g ${common}><path d="M142 332l228-228"/><path d="M202 352l168-168"/><path d="M146 246h86"/><path d="M280 112h86"/><path d="M280 400h86"/></g>`,
    regeneration: `<g ${common}><path d="M368 230a116 116 0 0 0-202-56"/><path d="M164 174h-54v-54"/><path d="M144 282a116 116 0 0 0 202 56"/><path d="M348 338h54v54"/></g><path d="M256 174v164M174 256h164" ${common}/>` ,
    crit_damage: `<path d="M256 104l37 100 106-34-54 96 90 66-109 14 4 112-74-84-74 84 4-112-109-14 90-66-54-96 106 34z" fill="${accent}" filter="url(#glow)"/><circle cx="256" cy="256" r="42" fill="${colors.white}" opacity="0.92"/>`,
  };
  return variants[type];
}

function weaponBody(type, accent) {
  const fill = `fill="url(#metal)" filter="url(#glow)"`;
  const stroke = `stroke="${accent}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#glow)"`;
  const variants = {
    pistol: `<path d="M143 215h212c22 0 36 13 36 32v22H248l-26 95h-65l22-95h-36z" ${fill}/><path d="M326 215l-18-47h64l39 47z" ${fill}/><path d="M176 270h74" ${stroke}/>`,
    shotgun: `<path d="M106 210h282c23 0 39 14 39 35v28H199l-28 83h-68l30-83h-27z" ${fill}/><path d="M378 205h58v78h-58z" ${fill}/><path d="M150 246h220" ${stroke}/>`,
    laser: `<path d="M122 230h198l66-54h48v160h-48l-66-54H122z" ${fill}/><path d="M112 256h226" ${stroke}/><circle cx="397" cy="256" r="35" fill="${accent}" filter="url(#glow)"/>`,
    rocket_launcher: `<path d="M114 222h230l58-56h44v180h-44l-58-56H114z" ${fill}/><path d="M157 294l-42 68h74l31-68z" ${fill}/><path d="M154 256h220" ${stroke}/>`,
  };
  return variants[type];
}

function abilityBody(type, accent) {
  const stroke = `stroke="${accent}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#glow)"`;
  const fill = `fill="url(#metal)" filter="url(#glow)"`;
  const variants = {
    shield_charge: `<path d="M256 104l132 50v91c0 91-53 144-132 177-79-33-132-86-132-177v-91z" ${fill}/><path d="M256 134v248" ${stroke}/>`,
    med_kit: `<rect x="142" y="170" width="228" height="204" rx="24" ${fill}/><path d="M208 154h96v42h-96z" fill="${accent}" filter="url(#glow)"/><path d="M256 214v116M198 272h116" ${stroke}/>` ,
    overcharge: `<path d="M284 82L142 286h94l-22 144 156-220h-96z" fill="${accent}" filter="url(#glow)"/><path d="M284 82L142 286h94l-22 144 156-220h-96z" fill="none" stroke="${colors.white}" stroke-opacity="0.7" stroke-width="6"/>`,
    locked: `<rect x="140" y="224" width="232" height="164" rx="28" ${fill}/><path d="M190 224v-58c0-45 29-80 66-80s66 35 66 80v58" ${stroke}/><circle cx="256" cy="304" r="18" fill="${colors.dark}"/><path d="M256 318v34" ${stroke}/>`,
  };
  return variants[type];
}

function systemBody(type, accent) {
  const stroke = `stroke="${accent}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#glow)"`;
  const variants = {
    currency_coin: `<circle cx="256" cy="256" r="116" fill="${colors.gold}" filter="url(#glow)"/><circle cx="256" cy="256" r="82" fill="none" stroke="${colors.white}" stroke-opacity="0.82" stroke-width="14"/><path d="M256 176v160M212 210c22-22 91-21 91 18 0 59-92 21-92 75 0 38 69 42 96 10" stroke="${colors.dark}" stroke-width="22" stroke-linecap="round" fill="none"/>`,
    settings_gear: `<path d="M256 142l28 14 30-20 34 34-20 30 14 28 36 7v48l-36 7-14 28 20 30-34 34-30-20-28 14-7 36h-48l-7-36-28-14-30 20-34-34 20-30-14-28-36-7v-48l36-7 14-28-20-30 34-34 30 20 28-14 7-36z" fill="${accent}" filter="url(#glow)"/><circle cx="256" cy="256" r="52" fill="${colors.dark}" stroke="${colors.white}" stroke-width="12"/>`,
  };
  return variants[type];
}

const icons = [
  ["perks/rapid_fire", svgShell(perkBody("rapid_fire", colors.gold), colors.gold)],
  ["perks/max_health", svgShell(perkBody("max_health", colors.green), colors.green)],
  ["perks/speed_boost", svgShell(perkBody("speed_boost", colors.blue), colors.blue)],
  ["perks/piercing", svgShell(perkBody("piercing", colors.purple), colors.purple)],
  ["perks/regeneration", svgShell(perkBody("regeneration", colors.green), colors.green)],
  ["perks/crit_damage", svgShell(perkBody("crit_damage", colors.red), colors.red)],
  ["weapons/pistol", svgShell(weaponBody("pistol", colors.cyan), colors.cyan)],
  ["weapons/shotgun", svgShell(weaponBody("shotgun", colors.cyan), colors.cyan)],
  ["weapons/laser", svgShell(weaponBody("laser", colors.blue), colors.blue)],
  ["weapons/rocket_launcher", svgShell(weaponBody("rocket_launcher", colors.red), colors.red)],
  ["abilities/shield_charge", svgShell(abilityBody("shield_charge", colors.cyan), colors.cyan)],
  ["abilities/med_kit", svgShell(abilityBody("med_kit", colors.red), colors.red)],
  ["abilities/overcharge", svgShell(abilityBody("overcharge", colors.blue), colors.blue)],
  ["abilities/locked", svgShell(abilityBody("locked", "#7da5c5"), "#7da5c5")],
  ["system/currency_coin", svgShell(systemBody("currency_coin", colors.gold), colors.gold)],
  ["system/settings_gear", svgShell(systemBody("settings_gear", colors.cyan), colors.cyan)],
];

for (const [name, svg] of icons) {
  const svgPath = `${outRoot}/${name}.svg`;
  const pngPath = `${outRoot}/${name}.png`;
  ensure(svgPath);
  writeFileSync(svgPath, svg);
  const result = spawnSync("/opt/homebrew/bin/rsvg-convert", [
    "--width", String(size),
    "--height", String(size),
    "--format", "png",
    "--output", pngPath,
    svgPath,
  ], { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`Failed to render ${name}: ${result.stderr || result.stdout}`);
  }
  console.log(pngPath);
}
