# WINDOWS93 — a clean-room tribute

**Live: https://xerohour.github.io/windows93/**

A from-scratch, Windows 93-inspired web desktop that runs entirely in the browser.
Boot it, drag the windows, and play.

## Why "clean-room"?

[windows93.net](https://www.windows93.net) — the surreal parody OS created by
jankenpopp & Zombectro in 2014 — is a copyrighted art project with no open-source
release. Mirroring its code, images, sounds or text to GitHub would redistribute
their work (and risk a DMCA takedown, the same reason Blizzard's client assets
stayed out of the Azeroth Survivors clone).

So this repo **recreates the experience with 100% original code**:

- No code, images, audio, or text copied from windows93.net
- All icons are emoji / CSS, all music is synthesised live with WebAudio
- All jokes are new (quality may vary, as tradition demands)

Go visit the real thing at windows93.net — then come back and break this one.

## What's inside

| Feature | Notes |
|---|---|
| Boot sequence | Fake BIOS → splash → teal desktop |
| Window manager | Drag, minimise, maximise, close, taskbar, z-order focus |
| Start menu + clock | Programs, Restart, BSOD, Shut Down |
| Notepad | Auto-saves to `localStorage` |
| Paint | Canvas drawing, colour palette, Save PNG |
| Calculator | Fully working |
| MS-DOS Prompt | `HELP`, `DIR`, `VER`, `ECHO`, `HYDRA`, `BSOD`, `SECRET.TXT`… |
| Minesweeper | 9×9, 10 mines, flag with right-click |
| Media Player 93 | Three original WebAudio chiptunes, played live |
| Internet Explorer 93 | 28.8 kbps of pure confidence |
| Hydra.exe | Close one window, two more take its place |
| BSOD | Full-screen, any key reboots |

Right-click (or long-press menu equivalent) the desktop for wallpaper cycling
and shortcuts. Works with touch: double-tap icons, drag title bars with a finger.

## The programs

Many Windows93 "programs" were actually third-party open-source projects —
its own app registry credits them. The verifiably open-source ones are cloned
here **from their upstreams**, under their own licenses (license files kept
in place, details in [THIRD_PARTY.md](THIRD_PARTY.md)):

- **SkiFree** — basicallydan/skifree.js (MIT) → `programs/skifree/`
- **Bytebeat** — greggman/html5bytebeat (MIT) → `programs/bytebeat/`
- **NES Emulator** — bfirsh/jsnes (Apache-2.0, built from source) with the
  free homebrew games LJ65 + Concentration Room → `programs/nes/`
- **Piskel** — piskelapp/piskel (Apache-2.0) — launcher window: the official
  editor blocks framing and its source doesn't build on modern Node

Checked and skipped, with reasons in THIRD_PARTY.md: calculate (no license),
GameBoy-Online (repo gone), Castle GAFA (Wolfenstein game data), SAE (needs
the copyrighted Kickstart ROM). Windows93's own apps were never open-sourced;
its **sys42** framework is, at github.com/windows93dotnet/sys42 (MIT).

## Second edition: the real sys42 code

**Live: https://xerohour.github.io/windows93/sys42/desktop/**

The `sys42/` folder is something different: a working boot of
[windows93dotnet/sys42](https://github.com/windows93dotnet/sys42) — the
Windows93 creators' own framework, published by them under the **MIT
license**. Its README says it "started as a cleanup of the Windows93
codebase", so this edition's shell, window manager, windows9x theme and
apps (including a genuine Hydra) are the original code, not a recreation.

It was made static-ready with 6 small patches (all marked
`STATIC PROTO PATCH`): the "backend" turned out to be just a
service-worker handshake, the filesystem defaults to IndexedDB, and the
patches make the boot tolerate service-worker failure and use relative
paths. The generated `files.cbor` index was rebuilt for the trimmed tree
with the project's own codec. Full write-up: `sys42/PROTO.md`.
sys42's MIT license is at `sys42/LICENSE`.

Known limitation: the service worker's virtual-file serving matches raw
URL paths, so under a project subpath like this one some *virtual* files
may miss (hosted files load normally). If an app misbehaves here, that's
the first suspect.

## Run locally

It's one static file — no build step:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## License

Original code in this repo: MIT. This is an unofficial tribute, not affiliated
with or endorsed by the windows93.net creators or Microsoft.
