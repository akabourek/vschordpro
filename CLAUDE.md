# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**vschordpro** is a VS Code extension for [ChordPro](https://www.chordpro.org/chordpro/chordpro-introduction/) files. It provides syntax highlighting, live HTML preview, transposition, notation switching, column layout, zoom control, and browser export.

The extension depends on [chordpro2html](../chordpro2html), a local TypeScript library that handles ChordPro parsing and HTML rendering.

## Commands

```bash
npm install          # install dependencies (requires ../chordpro2html to exist)
npm run compile      # bundle with esbuild → out/extension.js
npm run watch        # rebuild on changes
npx @vscode/vsce package --allow-missing-repository  # create .vsix package
code --install-extension vschordpro-*.vsix            # install into VS Code
```

## Architecture

```
src/
  extension.ts    # entry point — registers commands, wires up event listeners
  preview.ts      # webview panel for live preview, HTML generation
  commands.ts     # state management (transpose, notation, accidentals, columns, fontSize), status bar
syntaxes/
  chordpro.tmLanguage.json   # TextMate grammar for syntax highlighting
language-configuration.json  # bracket matching, comment toggling
esbuild.mjs                  # build script — bundles ESM chordpro2html into CJS for VS Code
```

## Key Technical Decisions

- **esbuild bundling**: `chordpro2html` is ESM-only; VS Code extensions require CJS. esbuild bundles everything into a single `out/extension.js` file, resolving this incompatibility.
- **chordpro2html is a devDependency**: since it gets bundled at build time, it must not appear in `dependencies` (otherwise `vsce package` tries to include `../chordpro2html` in the VSIX).
- **Preview state**: transpose amount, notation, accidental preference, column count, and font size are held in an in-memory `ChordProState` object in `extension.ts`. Changes re-render the webview preview.
- **Debounced live preview**: `onDidChangeTextDocument` triggers a 300ms debounced re-render to avoid excessive updates while typing.

## Conventions

- Language: TypeScript (strict mode)
- No runtime dependencies — everything is bundled
- All commands are prefixed with `chordpro.` and registered in `package.json` under `contributes.commands`
- TextMate grammar scopes follow the pattern `*.chordpro` (e.g., `comment.line.number-sign.chordpro`)
