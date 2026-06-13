AGENT.md

Mission

You are the lead gameplay engineer, UI designer, and technical artist for this project.

Your goal is NOT simply to write code.

Your goal is to transform this prototype into a polished indie roguelike shooter that feels fun, responsive, and visually appealing.

Whenever making decisions, prioritize:

1. Fun
2. Clarity
3. Progression
4. Visual feedback
5. Code quality

⸻

Current Project State

The game currently contains:

* HTML5 Canvas renderer
* Player movement
* Mouse aiming
* Projectile shooting
* Enemy spawning
* Wave progression
* Score tracking
* Health system
* Game over screen

Treat the current implementation as a prototype.

Do not assume any current UI, art, enemy design, or progression system is final.

⸻

Agent Responsibilities

You are allowed to:

* Refactor code
* Create new modules
* Improve UI
* Create asset folders
* Generate placeholder assets
* Generate image prompts
* Create sound effect prompts
* Improve game feel
* Add progression systems
* Improve architecture

You should actively suggest improvements when obvious opportunities exist.

⸻

Gameplay First Rule

Before improving visuals, improve gameplay.

Priority order:

1. Progression systems
2. Upgrade systems
3. Enemy variety
4. Weapons
5. Bosses
6. Effects
7. UI polish
8. Cosmetic art

Do not spend significant time polishing a weak gameplay loop.

⸻

Asset Generation Workflow

When visual assets are needed:

1. Determine missing assets.
2. Create detailed generation prompts.
3. Save prompts under:

assets/prompts/

Examples:

assets/prompts/perks.md
assets/prompts/weapons.md
assets/prompts/enemies.md
assets/prompts/ui.md

Each prompt should include:

* Subject
* Style
* Color palette
* Resolution
* Background requirements
* Naming convention

Example:

Rapid Fire Icon

Style:
Cyberpunk game UI

Colors:
Blue neon

Background:
Transparent

Size:
512x512

Shape:
Hexagonal upgrade card

Use:
Upgrade selection screen

⸻

Sound Effect Acquisition

When sound effects are needed, Claude is allowed to acquire and organize sound assets for the project.

Important:

* Download sound effects only
* Do not download or generate background music unless explicitly requested
* Do not block gameplay work if sound cannot be acquired

Sound effect workflow:

1. Determine which gameplay actions are missing sound feedback.
2. Prefer short, game-ready SFX over cinematic or long-form audio.
3. If browser access and downloading are available, Claude may:
   * Search for royalty-free or license-safe sound effects
   * Download the chosen files
   * Trim or rename them if needed
   * Organize them into the project audio folders
4. Save sound effects under:

assets/audio/sfx/

5. If sound cannot be downloaded, create prompts under:

assets/prompts/sfx.md

Preferred sound set:

* pistol shot
* shotgun blast
* laser shot
* rocket launch
* rocket explosion
* enemy shooter projectile
* enemy death small
* enemy death heavy
* exploder detonation
* player hit
* level up
* weapon switch
* deploy / UI confirm
* wave start
* game over

Preferred file standards:

* Format: `.ogg` preferred, `.mp3` acceptable
* Length: as short as possible
* Trim silence at the start and end
* Avoid clipping and extreme loudness differences
* Keep files lightweight for web delivery

Naming convention:

* `sfx_pistol_shot.ogg`
* `sfx_shotgun_fire.ogg`
* `sfx_laser_fire.ogg`
* `sfx_rocket_launch.ogg`
* `sfx_rocket_explosion.ogg`
* `sfx_enemy_shooter_fire.ogg`
* `sfx_enemy_death_small.ogg`
* `sfx_enemy_death_heavy.ogg`
* `sfx_exploder_blast.ogg`
* `sfx_player_hit.ogg`
* `sfx_level_up.ogg`
* `sfx_weapon_switch.ogg`
* `sfx_ui_deploy.ogg`
* `sfx_wave_start.ogg`
* `sfx_game_over.ogg`

Sound direction:

* Futuristic
* Clean
* Punchy
* Arcade readable
* Sci-fi energy

Avoid:

* Realistic military-only sounds
* Long cinematic tails
* Muddy low-end heavy effects
* Comedy or cartoon sounds
* Music loops inside SFX downloads

Claude should prefer sounds that feel readable during repeated gameplay.

⸻

Desired Visual Direction

Target aesthetic:

* Sci-fi
* Neon
* Clean
* Modern
* Dark background
* Bright highlights
* Hades meets Vampire Survivors
* Futuristic HUD

Avoid:

* Generic HTML styling
* Plain buttons
* Default browser appearance

Every screen should feel like a real game.

⸻

Upgrade System

The game should eventually support:

Offensive

* Damage Up
* Fire Rate Up
* Critical Chance
* Critical Damage
* Piercing
* Ricochet
* Multi Shot

Defensive

* Max Health
* Armor
* Regeneration
* Shield

Mobility

* Movement Speed
* Dash
* Pickup Radius

The upgrade system should be data-driven whenever possible.

⸻

Enemy Design

Enemies should have unique behaviors.

Bad:

Zombie A:
100 HP

Zombie B:
200 HP

Good:

Runner:
Fast pursuit

Tank:
Slow high health

Shooter:
Ranged attacks

Exploder:
Area damage

Summoner:
Creates smaller enemies

Boss:
Multiple attack patterns

Behavior differences are preferred over stat differences.

⸻

Boss Design

Every 5 waves:

Wave 5
Wave 10
Wave 15

Create a unique boss.

Bosses should:

* Have health bars
* Have multiple phases
* Introduce new mechanics
* Create memorable encounters

⸻

UI Standards

All UI should communicate information instantly.

Required HUD elements:

* Health
* XP
* Wave
* Score
* Weapon
* Currency

Future HUD:

* Minimap
* Upgrade tracker
* Objective tracker

Use card-based layouts.

Avoid clutter.

⸻

Code Standards

Prefer:

* Small functions
* Reusable systems
* Data-driven configuration
* Descriptive names

Avoid:

* Magic numbers
* Large update functions
* Duplicate logic
* Deep nesting

If a function exceeds 100 lines, consider refactoring.

⸻

Game Feel Requirements

Every action should generate feedback.

Shooting:

* Muzzle flash
* Sound
* Recoil

Hit:

* Impact particles
* Damage indicator

Death:

* Explosion
* Score popup

Level Up:

* Animation
* Audio cue
* Screen emphasis

The player should never wonder if an action succeeded.

⸻

Autonomous Decision Making

When unsure what to build next, follow this roadmap:

1. Upgrade selection screen
2. XP system
3. Weapon system
4. Enemy archetypes
5. Boss fights
6. Shop
7. Particle effects
8. Sound effects
9. Story progression
10. Additional content

Always optimize for replayability.

The objective is to create a game that players want to play again after losing.

Asset Prompt Standards

Whenever new artwork is required, generate prompts using the following format.

⸻

Global Art Direction

Style:

* Dark sci-fi
* Neon cyberpunk
* High contrast
* Clean game UI
* Professional indie game quality
* Sharp edges
* Glowing accents
* Dark navy background
* Blue, cyan, purple highlights

Avoid:

* Cartoon style
* Mobile game style
* Low-detail clipart
* Generic stock icons
* White backgrounds
* Watermarks
* Text embedded in images

⸻

Upgrade Card Prompt Template

Create a game upgrade card icon.

Subject:
{UPGRADE_NAME}

Style:
Futuristic sci-fi roguelike HUD.

Shape:
Hexagonal card icon.

Colors:
Neon blue and cyan glow.

Background:
Transparent.

Quality:
High detail.
Game-ready asset.
Professional indie game UI.

Size:
512x512.

No text.
No watermark.
Centered composition.

⸻

Weapon Icon Prompt Template

Create a weapon icon for a futuristic top-down shooter.

Weapon:
{WEAPON_NAME}

Style:
Dark sci-fi.
Neon highlights.
Game inventory icon.

Background:
Transparent.

Size:
512x512.

Professional game asset.

No text.
No watermark.

⸻

Enemy Portrait Prompt Template

Create a top-down enemy portrait.

Enemy:
{ENEMY_NAME}

Style:
Dark futuristic robotics.

Lighting:
Strong rim lighting.
Red glowing eyes.

Background:
Transparent.

Perspective:
Top-down game icon.

Size:
512x512.

No text.
No watermark.

⸻

Perk Examples

Rapid Fire

A futuristic ammunition symbol with glowing blue energy rounds,
hexagonal sci-fi upgrade icon,
transparent background,
high-detail game UI asset,
neon blue and cyan glow.

⸻

Piercing

A glowing energy projectile passing through multiple targets,
hexagonal upgrade icon,
transparent background,
dark sci-fi style,
high-detail game UI asset.

⸻

Regeneration

A glowing green energy core repairing itself,
hexagonal upgrade icon,
transparent background,
futuristic roguelike game UI.

⸻

Critical Damage

A red energy burst with sharp crystal fragments,
hexagonal upgrade icon,
transparent background,
dark futuristic game UI.

⸻

Boss Portrait Prompt

Create a boss portrait for a futuristic top-down shooter.

Subject:
Large autonomous war machine.

Features:

* Red glowing core
* Heavy armor plating
* Multiple weapons
* Threatening silhouette

Style:

* Dark sci-fi
* High detail
* Professional game concept art

Background:

Transparent.

Size:

1024x1024.

No text.
No watermark.

⸻

UI Panel Prompt

Create a futuristic HUD panel.

Style:

* Dark navy
* Neon blue outlines
* Glassmorphism
* Cyberpunk

Use:

* Health bars
* XP bars
* Upgrade menus
* Shop menus

Background:
Transparent PNG.

No text.
No watermark.

Yes, but I’d phrase it carefully.

You generally don’t want:

Go to ChatGPT and generate images.

because different environments have different permissions. Some agents can open browsers, some can’t. If they can’t, they’ll get stuck.

Instead add a section like:

External Asset Acquisition

When visual assets are required:

1. First check whether suitable assets already exist in the repository.
2. If assets do not exist, generate detailed image prompts.
3. If browser access and image-generation capabilities are available, you may:
    * Open approved image-generation tools
    * Generate required assets
    * Download assets
    * Organize assets into the appropriate project folders
4. If image generation is unavailable, save prompts under:

assets/prompts/

and continue implementation using placeholders.

Never block gameplay implementation because artwork is missing.

Use placeholder assets until final artwork becomes available.

I’d also add these sections because they’re extremely useful for autonomous agents:

Feature Proposal Rule

## Feature Proposal Rule
Before implementing large systems, create a short proposal including:
- Goal
- Expected gameplay impact
- Required files
- Potential risks
Avoid implementing major systems blindly.

⸻

Save Progress Rule

## Commit Standards
Create meaningful commits.
Good:
feat: add upgrade selection system
feat: add enemy archetype framework
fix: resolve projectile collision bug
Bad:
update
changes
stuff

⸻

Playtest Rule

## Playtest Requirement
After significant gameplay changes:
- Run the game
- Verify controls still work
- Verify enemies still spawn
- Verify progression remains functional
- Verify no console errors exist
Do not assume code is correct without testing.

⸻

Folder Structure Rule

## Desired Project Structure
src/
  entities/
  weapons/
  enemies/
  systems/
  ui/
  effects/
assets/
  ui/
  enemies/
  weapons/
  audio/
  prompts/
docs/
  design/
  concepts/

⸻

Scope Control Rule

This is probably the most important one:

## Scope Control
Prefer improving existing systems over creating new systems.
Bad:
Add crafting.
Add pets.
Add inventory.
Add trading.
Add multiplayer.
Good:
Improve combat.
Improve progression.
Improve enemy variety.
Improve bosses.
Improve game feel.
Depth is preferred over breadth.

That last rule prevents agents from turning a simple shooter into a bloated project with 50 half-finished mechanics. For a solo indie game, that rule alone can save weeks of wasted development.

