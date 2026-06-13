# Enemy Visual Plan

## Goal

Enemies should look instantly readable from a top-down view and support the core loop: dodge, aim, prioritize threats, collect rewards, repeat.

The enemy roster should feel like hostile sci-fi machines and corrupted combat units, not generic red circles.

Priorities:

1. Clear silhouette
2. Clear behavior
3. Clear threat level
4. Strong hit/death feedback
5. Easy asset generation

## Global Enemy Art Direction

Style:
Dark sci-fi, neon cyberpunk, robotic/armored enemies, Hades meets Vampire Survivors, clean top-down shooter readability.

Camera:
Top-down or slightly angled top-down.

Palette:
Enemy base colors should use dark gunmetal, black armor, red/orange hostile lights, and small accent colors by archetype.

Avoid:
Cartoon monsters, fantasy zombies, muddy silhouettes, tiny details that disappear at gameplay scale, white backgrounds, text, watermarks.

Required asset size:
`512x512`, `1:1 square`, transparent PNG for normal enemies.

Boss asset size:
`1024x1024`, `1:1 square`, transparent PNG.

## Visual Language

Player colors:
Cyan, blue, white glow.

Enemy colors:
Red and orange glow by default.

Elite enemy colors:
Red glow plus purple or gold secondary accents.

Boss colors:
Deep red core, orange warning lights, heavy armor, multiple weapon mounts.

Health/armor readability:
Larger enemies should look physically heavier, not just scaled up.

## Enemy Archetypes

### Runner

Gameplay role:
Fast melee pressure. Forces movement.

Look:
Small agile drone or cybernetic crawler with thin legs, forward-leaning body, red eye/core.

Silhouette:
Narrow, sharp, fast-looking.

Color:
Dark metal, red core, small cyan-suppressed sparks optional.

Behavior tell:
Leaves short red motion streaks while accelerating.

Asset prompt:
Create a top-down enemy sprite for a futuristic roguelike shooter.
Enemy: Runner drone.
Style: dark sci-fi robotics, neon cyberpunk, high contrast.
Features: small fast body, sharp legs, red glowing eye, aggressive forward silhouette.
Perspective: top-down game sprite.
Background: transparent.
Size: 512x512.
No text. No watermark.

### Tank

Gameplay role:
Slow high-health blocker. Absorbs shots and creates crowd pressure.

Look:
Heavy armored quadruped or compact walking turret with thick plating.

Silhouette:
Wide, bulky, shield-like front.

Color:
Black gunmetal armor, red core, orange armor vents.

Behavior tell:
Brief armor flash when hit, larger ground thump particles while moving.

Asset prompt:
Create a top-down enemy sprite for a futuristic roguelike shooter.
Enemy: Tank unit.
Style: dark futuristic robotics, heavy armor, neon hostile lighting.
Features: bulky armored body, wide shield-like front, red glowing core, orange vents.
Perspective: top-down game sprite.
Background: transparent.
Size: 512x512.
No text. No watermark.

### Shooter

Gameplay role:
Ranged threat. Makes the player dodge projectiles instead of only kiting.

Look:
Floating gun drone or tripod turret with visible barrel.

Silhouette:
Round/triangular body with a clear gun direction.

Color:
Dark metal, red targeting lens, yellow-orange muzzle elements.

Behavior tell:
Shows a thin red aim line before firing.

Asset prompt:
Create a top-down enemy sprite for a futuristic roguelike shooter.
Enemy: Shooter drone.
Style: dark sci-fi turret drone, clean readable game asset.
Features: visible weapon barrel, red targeting lens, compact armored body, orange muzzle glow.
Perspective: top-down game sprite.
Background: transparent.
Size: 512x512.
No text. No watermark.

### Exploder

Gameplay role:
Rushes player and detonates. Creates spacing decisions.

Look:
Unstable reactor bot with cracked glowing core.

Silhouette:
Round volatile body, exposed energy chamber.

Color:
Red/orange core, warning yellow highlights, dark shell.

Behavior tell:
Pulses brighter and beeps visually before exploding.

Asset prompt:
Create a top-down enemy sprite for a futuristic roguelike shooter.
Enemy: Exploder bot.
Style: dark cyberpunk robotics, unstable reactor design.
Features: cracked red-orange glowing core, warning yellow accents, compact armored shell.
Perspective: top-down game sprite.
Background: transparent.
Size: 512x512.
No text. No watermark.

### Summoner

Gameplay role:
Priority target. Spawns smaller enemies if ignored.

Look:
Tall hover unit or spidery command drone with antennae and portal emitters.

Silhouette:
Distinct central body with side arms or emitter fins.

Color:
Purple-red glow, dark armor, small cyan corrupted energy.

Behavior tell:
Draws a circular spawn glyph on the floor before releasing minions.

Asset prompt:
Create a top-down enemy sprite for a futuristic roguelike shooter.
Enemy: Summoner command drone.
Style: dark futuristic robotics, sinister cyberpunk energy.
Features: central armored body, side emitter arms, purple-red glow, small portal projectors.
Perspective: top-down game sprite.
Background: transparent.
Size: 512x512.
No text. No watermark.

## Boss Direction

Bosses should feel like set-piece enemies every 5 waves.

### Wave 5 Boss: Siege Core

Gameplay role:
First boss. Teaches projectile dodging and arena control.

Look:
Large autonomous war machine with circular red reactor core, heavy armor, two side cannons.

Phases:
Phase 1: Slow pursuit and cannon volleys.
Phase 2: Opens core and fires radial bullet bursts.

Asset prompt:
Create a boss sprite for a futuristic top-down roguelike shooter.
Subject: Large autonomous siege war machine.
Features: red glowing reactor core, heavy black armor, two side cannons, threatening silhouette.
Style: dark sci-fi, high detail, professional indie game asset.
Perspective: top-down boss sprite.
Background: transparent.
Size: 1024x1024.
No text. No watermark.

### Wave 10 Boss: Rift Harvester

Gameplay role:
Summons enemies and creates danger zones.

Look:
Hovering command machine with purple-red portal core and long emitter arms.

Phases:
Phase 1: Summons runners.
Phase 2: Creates rotating danger beams.

### Wave 15 Boss: Omega Warden

Gameplay role:
Final early-game skill check.

Look:
Huge armored hunter unit with multiple attack pods, orange-red visor, and shield plates.

Phases:
Phase 1: Missile barrages.
Phase 2: Dash slams.
Phase 3: Exposed core with faster attacks.

## Gameplay Readability Rules

Every enemy needs:
- A unique silhouette
- A unique movement style
- A unique color accent or glow shape
- A unique warning tell before special attacks

Do not rely on size alone to communicate type.

## Suggested Implementation Order

1. Runner
2. Tank
3. Shooter
4. Exploder
5. Summoner
6. Wave 5 boss
7. Wave 10 boss
8. Wave 15 boss

## Asset Folder Plan

Enemy sprites:
`assets/enemies/`

Enemy prompts:
`assets/prompts/enemies.md`

Boss sprites:
`assets/enemies/bosses/`

Design docs:
`docs/design/enemy-visual-plan.md`

## First Asset Batch Needed

Generate these first:
- `enemy_runner.png`, 512x512, transparent
- `enemy_tank.png`, 512x512, transparent
- `enemy_shooter.png`, 512x512, transparent
- `enemy_exploder.png`, 512x512, transparent
- `enemy_summoner.png`, 512x512, transparent
- `boss_siege_core.png`, 1024x1024, transparent

These are enough to replace circles with readable enemies and start building behavior variety.
