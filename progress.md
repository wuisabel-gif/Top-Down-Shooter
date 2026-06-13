Original prompt: i updated a few energy png in enermy folder upgrade the game accordingly also the shooter shoudl be shoting different type of bullet/icon accorignly rocket shoudl also have the highest destruction

## 2026-06-12

- Added enemy archetype configs for runner, tank, shooter, and exploder using the new `assets/enermy/` PNG files.
- Added shooter enemy bullets, exploder blast behavior, enemy rewards by type, rocket shockwaves, and stronger rocket splash damage.
- Added distinct canvas projectile icons for pistol, shotgun, laser, rocket, and enemy shooter shots.
- Added `window.render_game_to_text` and `window.advanceTime` for automated game testing.
- Verified with `node --check game.js` and a mocked canvas runtime: all four enemy types spawn by wave 4, rocket uses the boosted splash stats, and shooter enemies emit enemy bullets.
- Expanded pilot selection to 12 pilots, including the new portrait files in `assets/player/portraits/`, and converted the pilot cards to render from the data-driven `pilots` array.
- Verified all configured pilot portrait paths exist and mocked the selection runtime to confirm 12 cards render and the new `Aegis` pilot applies stats.
- Replaced the ad hoc weapon array with a data-driven `WEAPONS` config plus stable `weaponOrder`, and routed weapon selection, fire rate, projectile count, pierce, crits, knockback, and rocket splash values through config lookups.
- Verified with `node --check game.js` and a mocked runtime probe that number-key selection still maps to pistol, shotgun, laser, and rocket in order, with the configured stats exposed through the active weapon data.
- Added the new `Echo` and `Oracle` portraits to the pilot selection roster and renamed the `Idol` card to `Idol Pilot`, while correcting its portrait path to `pilot-idol.png`.
- Verified 14 pilot cards are configured and all portrait assets resolve.
- Updated `AGENTS.md` with a Claude-facing sound effect acquisition section that covers SFX-only downloading, target filenames, storage under `assets/audio/sfx/`, and a hard rule to avoid downloading music unless explicitly requested.
- Downloaded Kenney `Sci-fi Sounds`, `Impact Sounds`, and `Interface Sounds` packs into `assets/audio/sfx/kenney/`.
- Curated 15 game-ready audio files into `assets/audio/sfx/final/` and mirrored the user-provided theme music to `assets/audio/music/theme_music.mp3`, with sources documented in `assets/audio/audio_manifest.md`.
- Wired the curated SFX and theme music into `game.js`: deploy now unlocks audio and starts background music, and weapon fire, enemy shots, explosions, hits, deaths, level-up, wave start, weapon switch, and game over all trigger sounds.
- Verified with `node --check game.js` and a mocked runtime that deploy starts music and firing still spawns projectiles with the active weapon.
- Eased the first two waves: wave 1 now has fewer enemies, waves 1-2 spawn only runners, early enemies have reduced HP/speed, elites start after wave 2, and early spawn pacing is slower.
- Updated weapon rows so the progress pips reflect relative weapon damage and locked weapons show different coin costs before they can be used.
- Verified with `node --check game.js` and a mocked runtime that wave 1 starts easier, wave 2 remains runner-only, and buying the shotgun spends 8 coins before switching weapons.

TODO:
- Consider renaming `assets/enermy/` to `assets/enemy/` later with path updates, but leave it as-is while the user is actively adding files there.
- Add sound effects for shooter charge, exploder warning, and rocket detonation.
