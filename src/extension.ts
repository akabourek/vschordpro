import * as vscode from "vscode";
import { showPreview, updatePreview, scheduleUpdate, isPreviewOpen, PreviewOptions, generateHtml } from "./preview";
import {
  ChordProState,
  createState,
  getOptions,
  initStatusBar,
  updateStatusBar,
  persistState,
} from "./commands";

export function activate(context: vscode.ExtensionContext): void {
  const state: ChordProState = createState();
  const opts = (): PreviewOptions => ({
    chordpro: getOptions(state),
    fontSize: state.fontSize,
  });

  initStatusBar(context);
  updateStatusBar(state);

  // Preview command
  context.subscriptions.push(
    vscode.commands.registerCommand("chordpro.showPreview", () => {
      showPreview(context, opts);
    })
  );

  // Transpose commands
  context.subscriptions.push(
    vscode.commands.registerCommand("chordpro.transposeUp", () => {
      state.transpose++;
      updateStatusBar(state);
      refreshPreview();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("chordpro.transposeDown", () => {
      state.transpose--;
      updateStatusBar(state);
      refreshPreview();
    })
  );

  // Notation commands
  context.subscriptions.push(
    vscode.commands.registerCommand("chordpro.setNotationStandard", () => {
      state.notation = "standard";
      persistState(state);
      updateStatusBar(state);
      refreshPreview();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("chordpro.setNotationGerman", () => {
      state.notation = "german";
      persistState(state);
      updateStatusBar(state);
      refreshPreview();
    })
  );

  // Accidental commands
  context.subscriptions.push(
    vscode.commands.registerCommand("chordpro.setAccidentalSharp", () => {
      state.accidentalPreference = "sharp";
      updateStatusBar(state);
      refreshPreview();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("chordpro.setAccidentalFlat", () => {
      state.accidentalPreference = "flat";
      updateStatusBar(state);
      refreshPreview();
    })
  );

  // Column commands
  context.subscriptions.push(
    vscode.commands.registerCommand("chordpro.addColumn", () => {
      if (state.columns < 4) state.columns++;
      persistState(state);
      updateStatusBar(state);
      refreshPreview();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("chordpro.removeColumn", () => {
      if (state.columns > 1) state.columns--;
      persistState(state);
      updateStatusBar(state);
      refreshPreview();
    })
  );

  // Font size commands
  context.subscriptions.push(
    vscode.commands.registerCommand("chordpro.zoomIn", () => {
      state.fontSize = Math.min(state.fontSize + 2, 48);
      updateStatusBar(state);
      refreshPreview();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("chordpro.zoomOut", () => {
      state.fontSize = Math.max(state.fontSize - 2, 8);
      updateStatusBar(state);
      refreshPreview();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("chordpro.zoomReset", () => {
      state.fontSize = 16;
      updateStatusBar(state);
      refreshPreview();
    })
  );

  // Open in browser
  context.subscriptions.push(
    vscode.commands.registerCommand("chordpro.openInBrowser", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== "chordpro") {
        vscode.window.showWarningMessage("Open a ChordPro file first.");
        return;
      }
      const html = generateHtml(editor.document, opts);
      const os = await import("os");
      const path = await import("path");
      const fs = await import("fs");
      const tmpFile = path.join(os.tmpdir(), "chordpro-preview.html");
      fs.writeFileSync(tmpFile, html);
      vscode.env.openExternal(vscode.Uri.file(tmpFile));
    })
  );

  // Live update on text change
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (
        isPreviewOpen() &&
        e.document.languageId === "chordpro" &&
        e.contentChanges.length > 0
      ) {
        scheduleUpdate(e.document, opts);
      }
    })
  );

  // Update status bar and preview when active editor changes
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      updateStatusBar(state);
      if (editor && isPreviewOpen() && editor.document.languageId === "chordpro") {
        updatePreview(editor.document, opts);
      }
    })
  );

  function refreshPreview(): void {
    const editor = vscode.window.activeTextEditor;
    if (editor && isPreviewOpen()) {
      updatePreview(editor.document, opts);
    }
  }
}

export function deactivate(): void {}
