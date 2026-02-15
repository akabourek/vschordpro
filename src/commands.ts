import * as vscode from "vscode";
import type { Notation, AccidentalPreference, ChordproOptions } from "chordpro2html";

export interface ChordProState {
  transpose: number;
  notation: Notation;
  accidentalPreference: AccidentalPreference;
  columns: number;
  fontSize: number;
}

let statusBarItem: vscode.StatusBarItem;

export function createState(): ChordProState {
  const config = vscode.workspace.getConfiguration("chordpro");
  return {
    transpose: 0,
    notation: config.get<Notation>("notation", "standard"),
    accidentalPreference: "sharp",
    columns: config.get<number>("columns", 1),
    fontSize: 16,
  };
}

export function persistState(state: ChordProState): void {
  const config = vscode.workspace.getConfiguration("chordpro");
  config.update("notation", state.notation, vscode.ConfigurationTarget.Workspace);
  config.update("columns", state.columns, vscode.ConfigurationTarget.Workspace);
}

export function getOptions(state: ChordProState): ChordproOptions {
  return {
    transpose: state.transpose || undefined,
    notation: state.notation,
    accidentalPreference: state.accidentalPreference,
    columns: state.columns > 1 ? state.columns : undefined,
  };
}

export function initStatusBar(context: vscode.ExtensionContext): void {
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  context.subscriptions.push(statusBarItem);
}

export function updateStatusBar(state: ChordProState): void {
  if (!statusBarItem) return;

  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== "chordpro") {
    statusBarItem.hide();
    return;
  }

  const sign = state.transpose >= 0 ? "+" : "";
  const notation = state.notation === "german" ? "German" : "Standard";
  const accidental = state.accidentalPreference === "flat" ? "b" : "#";
  const cols = state.columns === 1 ? "1 col" : `${state.columns} cols`;
  statusBarItem.text = `$(music) ${sign}${state.transpose} | ${notation} | ${accidental} | ${cols} | ${state.fontSize}px`;
  statusBarItem.tooltip = "ChordPro: transpose / notation / accidentals / columns / font size";
  statusBarItem.show();
}
