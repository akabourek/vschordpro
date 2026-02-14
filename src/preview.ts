import * as vscode from "vscode";
import { chordproToHtml } from "chordpro2html";
import type { ChordproOptions } from "chordpro2html";

export interface PreviewOptions {
  chordpro: ChordproOptions;
  fontSize: number;
}

let panel: vscode.WebviewPanel | undefined;
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

export function showPreview(
  context: vscode.ExtensionContext,
  getOptions: () => PreviewOptions
): void {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== "chordpro") {
    vscode.window.showWarningMessage("Open a ChordPro file first.");
    return;
  }

  if (panel) {
    panel.reveal(vscode.ViewColumn.Beside);
    updatePreview(editor.document, getOptions);
    return;
  }

  panel = vscode.window.createWebviewPanel(
    "chordproPreview",
    "ChordPro Preview",
    vscode.ViewColumn.Beside,
    { enableScripts: false }
  );

  panel.onDidDispose(
    () => {
      panel = undefined;
    },
    null,
    context.subscriptions
  );

  updatePreview(editor.document, getOptions);
}

export function updatePreview(
  document: vscode.TextDocument,
  getOptions: () => PreviewOptions
): void {
  if (!panel) return;
  if (document.languageId !== "chordpro") return;

  const source = document.getText();
  const { chordpro, fontSize } = getOptions();
  const html = chordproToHtml(source, { ...chordpro, fullPage: true });
  // Inject font-size override into the <head>
  const styled = html.replace(
    "</style>",
    `body { font-size: ${fontSize}px; }\n</style>`
  );
  panel.webview.html = styled;
}

export function scheduleUpdate(
  document: vscode.TextDocument,
  getOptions: () => PreviewOptions
): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => updatePreview(document, getOptions), 300);
}

export function isPreviewOpen(): boolean {
  return panel !== undefined;
}

export function generateHtml(
  document: vscode.TextDocument,
  getOptions: () => PreviewOptions
): string {
  const source = document.getText();
  const { chordpro, fontSize } = getOptions();
  const html = chordproToHtml(source, { ...chordpro, fullPage: true });
  return html.replace(
    "</style>",
    `body { font-size: ${fontSize}px; }\n</style>`
  );
}
