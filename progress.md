Original prompt: i updated a few energy png in enermy folder upgrade the game accordingly also the shooter shoudl be shoting different type of bullet/icon accorignly rocket shoudl also have the highest destruction

## 2026-06-12

- Added enemy archetype configs for runner, tank, shooter, and exploder using the new `assets/enermy/` PNG files.
- Added shooter enemy bullets, exploder blast behavior, enemy rewards by type, rocket shockwaves, and stronger rocket splash damage.
- Added distinct canvas projectile icons for pistol, shotgun, laser, rocket, and enemy shooter shots.
- Added `window.render_game_to_text` and `window.advanceTime` for automated game testing.
- Verified with `node --check game.js` and a mocked canvas runtime: all four enemy types spawn by wave 4, rocket uses the boosted splash stats, and shooter enemies emit enemy bullets.
- Expanded pilot selection to 12 pilots, including the new portrait files in `assets/player/portraits/`, and converted the pilot cards to render from the data-driven `pilots` array.
- Verified all configured pilot portrait paths exist and mocked the selection runtime to confirm 12 cards render and the new `Aegis` pilot applies stats.

TODO:
- Consider renaming `assets/enermy/` to `assets/enemy/` later with path updates, but leave it as-is while the user is actively adding files there.
- Add sound effects for shooter charge, exploder warning, and rocket detonation.
