# ChordPro for VS Code

A VS Code extension providing ChordPro syntax highlighting, live HTML preview, transposition, notation switching, and browser export.

## Features

- **Syntax highlighting** for `.chordpro`, `.cho`, `.crd`, `.chopro` files — chords, directives, sections, comments, and tab blocks
- **Live preview** panel (Ctrl+Shift+V) that updates as you type
- **Transpose** up/down by semitone
- **Notation switching** between Standard (C D E F G A B) and German (C D E F G A H)
- **Accidental preference** — sharp (#) or flat (b)
- **Column layout** — 1 to 4 columns in the preview
- **Zoom** — increase/decrease font size in the preview
- **Open in browser** — export the rendered HTML to your default browser
- **Status bar** showing current transpose, notation, accidentals, columns, and font size

## Commands

All commands are available via the Command Palette (Ctrl+Shift+P):

| Command | Description |
|---------|-------------|
| ChordPro: Open Preview to the Side | Open live preview (also Ctrl+Shift+V) |
| ChordPro: Transpose Up (semitone) | Transpose all chords up |
| ChordPro: Transpose Down (semitone) | Transpose all chords down |
| ChordPro: Set Notation — Standard | Use standard notation (B) |
| ChordPro: Set Notation — German | Use German notation (H) |
| ChordPro: Set Accidentals — Sharp (#) | Prefer sharps when transposing |
| ChordPro: Set Accidentals — Flat (b) | Prefer flats when transposing |
| ChordPro: Add Column | Add a column to the preview layout (max 4) |
| ChordPro: Remove Column | Remove a column from the preview layout (min 1) |
| ChordPro: Zoom In | Increase preview font size |
| ChordPro: Zoom Out | Decrease preview font size |
| ChordPro: Reset Zoom | Reset preview font size to default |
| ChordPro: Open in Browser | Open rendered HTML in the default browser |

## Building the VSIX package

Prerequisites: [Node.js](https://nodejs.org/) (v18+)

```bash
# Install dependencies
npm install

# Build the extension
npm run compile

# Package as VSIX
npx @vscode/vsce package --allow-missing-repository
```

This produces a `vschordpro-<version>.vsix` file in the project root.

## Installing the VSIX

```bash
code --install-extension vschordpro-0.1.0.vsix
```

Or in VS Code: Extensions view → `...` menu → "Install from VSIX..." and select the file.

## Development

```bash
# Watch mode (rebuilds on changes)
npm run watch
```

Press F5 in VS Code to launch the Extension Development Host with the extension loaded.

## Dependencies

Uses **chordpro2html** as a local dependency for ChordPro parsing and HTML rendering. The library is bundled into the extension output via esbuild, so it is not required at runtime.
