import {BoardAction} from "./types/proofBoard";

export const BOARD_WIDTH = 5000
export const BOARD_HEIGHT = 2500
export const MIN_SCALE = 0.5
export const MAX_SCALE = 3
export const INT_SCALE = 1

export const BOARD_COMPONENT_ID = "board"
export const DELETE_COMPONENT_ID = "delete"
export const CLONE_COMPONENT_ID = "clone"
export const EXP_KEYBOARD_COMPONENT_ID = "exp-keyboard"
export const EXP_INPUT_COMPONENT_ID = "input-expression"
export const RULE_KEYBOARD_COMPONENT_ID = "rule-keyboard"
export const MARK_KEYBOARD_COMPONENT_ID = "mark-keyboard"

export const APPENDS = {
    APPEND_MARK_COMPONENT_ID: 0,
    APPEND_RULE_COMPONENT_ID: 0,
};

export const DOUBLE_CLICK_THRESHOLD  = 250

export const LOGICAL_SYMBOLS: string[] = ['⊥', '⊤', '¬', '∧', '∨', '→', '∀', '∃'];
export const GROUPING_SYMBOLS: string[] = ['(', ')'];
export const GREEK_LETTERS: string[] = ['α', 'β', 'γ', 'δ', 'φ', 'ψ'];
export const MARKS_SYMBOLS = Array.from({length: 20}, (_, i) => (i + 1).toString());

export const KeyActionMap: Map<string, BoardAction> = new Map([
    ['Backspace', BoardAction.Delete],
    ['Delete', BoardAction.Delete],
    ['Ctrl+KeyZ', BoardAction.Undo],
    ['Ctrl+KeyY', BoardAction.Redo],
    ['Ctrl+KeyC', BoardAction.Copy],
    ['Ctrl+KeyV', BoardAction.Paste],
]);