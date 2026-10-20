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

### Bundled NES games (homebrew only)

- **LJ65** and **Concentration Room** by Damian Yerrick — free homebrew,
  included in JSNES's own repo as demos; their distribution notices are kept
  in `programs/nes/roms/`. No commercial ROMs are shipped; the player has a
  file picker for loading your own `.nes` files.

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

## The framework

Windows93 v3 runs on **sys42**, which the team *does* publish as open source:
[windows93dotnet/sys42](https://github.com/windows93dotnet/sys42) — MIT.
This tribute doesn't use it (our shell is original, single-file code), but if
you want to build real Windows93-style apps, sys42 is the genuine article.
