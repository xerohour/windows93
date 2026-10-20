# Third-party programs — the open-source software Windows93 bundled

Many of the "programs" inside Windows93 were never written by the Windows93
team: they are third-party open-source projects, credited in Windows93 v2's
own app registry (`sys/apps.js` on v2.windows93.net). Those upstreams are what
this repo clones — sourced from their own repositories, under their own
licenses, with their license files kept in place.

## Cloned and vendored in `programs/`

| Windows93 program | Upstream | License | In this repo |
|---|---|---|---|
| SkiFree | [basicallydan/skifree.js](https://github.com/basicallydan/skifree.js) — Daniel Hough's JS remake of SkiFree | MIT (`programs/skifree/license.md`) | `programs/skifree/` — full runtime + source |
| Byte Beat | [greggman/html5bytebeat](https://github.com/greggman/html5bytebeat) — Gregg Tavares' bytebeat music editor/player | MIT (`programs/bytebeat/LICENSE.md`) | `programs/bytebeat/` — editor + player runtime |
| NES Emulator | [bfirsh/jsnes](https://github.com/bfirsh/jsnes) — JSNES, NES emulator in JavaScript | Apache-2.0 (`programs/nes/LICENSE.txt`) | `programs/nes/` — `jsnes.min.js` built here from upstream source, plus a small original player page |
| Font Viewer ("font") | [opentypejs/opentype.js](https://github.com/opentypejs/opentype.js) — font parsing/rendering library (the Windows93 registry's own credit links its MIT license) | MIT (`programs/fontviewer/LICENSE.txt`) | `programs/fontviewer/` — official `opentype.min.js` dist plus an original viewer page (preview + glyph grid). Sample font VT323 is SIL OFL (`programs/fontviewer/FONT-LICENSE.txt`) |
| zkype | [auduno/clmtrackr](https://github.com/auduno/clmtrackr) — face tracking in JavaScript | MIT (`programs/zkype/LICENSE.txt`) | `programs/zkype/` — `clmtrackr.min.js` + the PCA/SVM model from upstream, plus an original parody call page; tracking runs locally, camera never leaves the device |

### Bundled NES games (homebrew only)

- **LJ65** and **Concentration Room** by Damian Yerrick — free homebrew,
  included in JSNES's own repo as demos; their distribution notices are kept
  in `programs/nes/roms/`. No commercial ROMs are shipped; the player has a
  file picker for loading your own `.nes` files.

## More open-source JavaScript games (not from Windows93)

Added at the owner's request — these weren't part of Windows93; they're
famous open-source browser games that fit the desktop:

| Game | Upstream | License | In this repo |
|---|---|---|---|
| 2048 | [gabrielecirulli/2048](https://github.com/gabrielecirulli/2048) | MIT (`programs/2048/LICENSE.txt`) | `programs/2048/` — full game |
| Hextris | [Hextris/hextris](https://github.com/Hextris/hextris) (gh-pages build) | GPL-3.0 (`programs/hextris/LICENSE.md`) | `programs/hextris/` — full game |
| A Dark Room | [doublespeakgames/adarkroom](https://github.com/doublespeakgames/adarkroom) | MPL-2.0 (`programs/adarkroom/LICENSE.md`) | `programs/adarkroom/` — full game (dev files excluded); source: upstream repo |
| DOOM | engine: [Chocolate Doom](https://github.com/chocolate-doom/chocolate-doom) via [cloudflare/doom-wasm](https://github.com/cloudflare/doom-wasm), compiled to WebAssembly locally with Emscripten 2.0.34 (upstream build flags, except TOTAL_MEMORY raised to 256 MB for the larger IWAD); data: Freedoom 0.13.0 Phase 1 IWAD (freedoom1.wad, shipped as doom1.wad because the loader expects that name) | GPL-2.0 (engine) + BSD-style (Freedoom) | **Built and shipped** in `programs/doom/` (loader page adapted from the engine repo's own index.html; engine GPL text in ENGINE-COPYING.md, Freedoom license + credits in FREEDOOM-COPYING.txt / FREEDOOM-CREDITS.txt). Verified playable end-to-end: attract demo, menus, and a new game all run. id Software's WAD is never used. The newer Emscripten 3.1.64 build of this 2021-era port crashes at game start (memory access out of bounds) — the era-matched 2.0.34 toolchain is the fix. |

## Original reimplementations (concept only — no upstream to clone)

A full audit of the v2 registry found no credited upstream for the apps
below: they are the Windows93 team's own programs, with no public source.
Like the main shell's own Minesweeper/Calculator, these are **original
implementations written for this repo** recreating generic concepts —
no Windows93 code, text or assets were copied:

| Windows93 program | Our version | In this repo |
|---|---|---|
| mines | Minesweeper (3 difficulties, flood-fill, flags, timer) | `programs/minesweeper/` |
| solitude | Klondike solitaire (draw 1, click-to-move) | `programs/solitude/` |
| gameoflife | Conway's Game of Life (draw cells, run/step, glider) | `programs/gameoflife/` |
| HexEd | Hex viewer/editor (open file, edit bytes, save copy) | `programs/hexed/` |
| defrag | The defragmentation gag as an animation | `programs/defrag/` |
| speech | Text-to-speech toy on the browser's speech synthesis | `programs/speech/` |
| recorder | Microphone recorder (MediaRecorder, local only) | `programs/recorder/` |
| bananamp | Chiptune player — all tracks synthesized live with WebAudio | `programs/bananamp/` |
| whatif | Full-window Matrix rain with speed/density controls | `programs/matrix/` |

## Included as a launcher (not vendored)

| Windows93 program | Upstream | License | Why |
|---|---|---|---|
| Piskel | [piskelapp/piskel](https://github.com/piskelapp/piskel) | Apache-2.0 | piskelapp.com sends `frame-ancestors 'none'` (can't be iframed), its current source fails to build on modern Node (vite/esbuild crash, verified 2026-10-20), and its `gh-pages` branch is a 23 MB pile of 2016-era builds. The desktop's Piskel window launches the official editor instead. |

## Checked and skipped

| Program (Windows93 name) | Upstream | Why skipped |
|---|---|---|
| Calculator ("calculate") | timothyarmstrong/calculate | **No license file** in the repo — crediting is not a license, so it can't be redistributed. (Our desktop already has an original calculator.) |
| GameBoy emulator | grantgalitz/GameBoy-Online | Upstream repo no longer public (clone returns 404/auth). |
| Castle GAFA 3D | loadx/html5-wolfenstein3D | Bundles Wolfenstein 3D game data — id Software's copyright, whatever the port's code license says. |
| Scripted Amiga Emulator (SAE) | naTmeg/Scripted-Amiga-Emulator | Useless without the Amiga Kickstart ROM, which is Cloanto/Amiga copyright. |
| Virtual PC | — | Not a separate program: it's Windows93 loading itself in a window. The joke is preserved in spirit. |
| Star Wars ASCII | asciimation.co.nz (Simon Jansen) | A copyrighted ASCII film, not licensed open-source software. |
| Hydra, Trollbox, Cat Explorer, Robby, 93 Realms, etc. | The Windows93 team | Their own creations; no public source release exists. Recreated in spirit (Hydra) or re-imagined (our fake browser) in the main app instead. |
| Tic-tac-toe ("wat") | aglemann/tic-tac-toe | **No license file** in the repo — same rule as the calculator: credit isn't a license. |
| Pure Data player ("pd") | sebpiq/WebPd | LGPL-3.0, and the patch the app plays is the team's own content; embedding would need a from-scratch patch and LGPL compliance work. Skipped for this pass. |
| Emulatorz set (dmg/sms/sae…) | grantgalitz & others | Mixed/unclear licensing across the set, and ROM/BIOS exposure on top. JSNES (already included) covers the NES slot cleanly. |
| acidBox93 | CODEF framework (codef.santo.fr) | acidBox93 is a demo *production* built on the framework — crediting the framework doesn't license the demo. |
| Progress Quest | Eric Fredricksen (grumdrig) | Free to play, but no open-source license for redistribution. |

## The framework

Windows93 v3 runs on **sys42**, which the team *does* publish as open source:
[windows93dotnet/sys42](https://github.com/windows93dotnet/sys42) — MIT.
This tribute doesn't use it (our shell is original, single-file code), but if
you want to build real Windows93-style apps, sys42 is the genuine article.

## sys42-native app wrappers (2026-10-20)

The five vendored programs above are also wired into the sys42 desktop
(`sys42/`) as native apps, so they launch from its Start menu and from
desktop shortcuts:
`sys42/42/os/apps/{SkiFree,Bytebeat,NES,FontViewer,Zkype}/` each contain an original
wrapper (`app.json5` manifest + `index.html`, written for this repo) that
hosts the corresponding `programs/` entry point in an isolated iframe
inside a sys42 window, plus small original icons. No program code was
modified; licenses stay as listed in the table above (SkiFree MIT,
Bytebeat MIT, JSNES Apache-2.0, bundled ROMs homebrew with notices kept
in `programs/nes/roms/`). The wrappers contain no Windows93-team code and
no material from the AGPL-3.0 v3 community documentation — that was used
as reference only. sys42 itself remains MIT (`sys42/LICENSE`), kept
separate from the programs' licenses.
