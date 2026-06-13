# Neon Breach

A neon sci-fi browser shooter built with plain HTML, CSS, and JavaScript.

![Live demo screenshot](assets/readme/live-demo.png)

## Live Demo

Play here: [https://wuisabel-gif.github.io/Top-Down-Shooter/](https://wuisabel-gif.github.io/Top-Down-Shooter/)

## What Is In The Game

- Pilot selection with 14 playable character cards
- Data-driven weapon system for pistol, shotgun, laser, and rocket launcher
- Wave-based survival loop with score, currency, XP, and level progression
- Enemy archetypes with different behavior: runner, tank, shooter, and exploder
- Enemy projectiles, splash damage, knockback, crits, piercing, and shockwave effects
- Mobile touch controls and portrait-to-landscape guard for phones

## Game Logic

Most gameplay logic lives in `game.js`.

- `WEAPONS` defines weapon balance in one place, including damage, fire rate, projectile speed, spread, projectile count, pierce, knockback, crit chance, crit multiplier, and explosion values.
- `enemyTypes` defines enemy archetypes and their combat behavior.
- The main loop handles movement, spawning, combat, collisions, rewards, HUD updates, and rendering.
- Pilot selection is data-driven, so adding new character cards mostly means adding portrait assets and a new pilot entry.

## Art And UI Notes

- All UI icons were generated with ChatGPT.
- Several HUD, control, and selection assets were generated or assembled with ChatGPT as part of the visual iteration process.
- Enemy and player portrait assets in the repository are integrated directly into the in-game HUD and selection screens.

## Controls

- Move: `WASD` or Arrow Keys
- Aim: Mouse
- Shoot: Left Click or `Space`
- Switch weapons: `1` `2` `3` `4`
- Restart after death: `R`

## Mobile

- The game includes mobile HUD scaling and fixed touch controls.
- On phones, the game blocks portrait mode and asks the player to rotate to landscape.

## Run Locally

Open `index.html` in your browser, or run a simple static server such as:

```bash
python3 -m http.server 4174
```

Then open `http://localhost:4174/`.

## Project Structure

- `index.html` - game layout, HUD, pilot selection, and mobile overlays
- `style.css` - desktop and mobile UI styling
- `game.js` - core gameplay systems, rendering, weapons, enemies, and progression
- `assets/` - UI, portraits, icons, prompts, and gameplay art

## Current Direction

This project is no longer just a prototype arena. The current direction is a more polished roguelike shooter with:

- clearer weapon identities
- stronger enemy behavior variety
- better HUD readability
- more character selection and mobile support
