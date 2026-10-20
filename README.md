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

## Run locally

It's one static file — no build step:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## License

Original code in this repo: MIT. This is an unofficial tribute, not affiliated
with or endorsed by the windows93.net creators or Microsoft.
