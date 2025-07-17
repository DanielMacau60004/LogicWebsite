import {BoardAction} from "./types/proofBoard";

export const BOARD_WIDTH = 5000
export const BOARD_HEIGHT = 2500
export const MIN_SCALE = 0.5
export const MAX_SCALE = 3
export const INT_SCALE = 1

export const BOARD_COMPONENT_ID = "board"
export const BOARD_CONTROLLERS_ID = "board-controllers"
export const DELETE_COMPONENT_ID = "delete"
export const CLONE_COMPONENT_ID = "clone"
export const SUBMIT_COMPONENT_ID = "submit"
export const EXP_KEYBOARD_COMPONENT_ID = "exp-keyboard"
export const EXP_INPUT_COMPONENT_ID = "input-expression"
export const RULE_KEYBOARD_COMPONENT_ID = "rule-keyboard"
export const MARK_KEYBOARD_COMPONENT_ID = "mark-keyboard"

export const APPENDS = {
    APPEND_MAIN_COMPONENT_ID: 0,
    APPEND_TREE_COMPONENT_ID: 0,
    APPEND_MARK_COMPONENT_ID: 0,
    APPEND_RULE_COMPONENT_ID: 0,
};

export const DOUBLE_CLICK_THRESHOLD  = 250

export const LOGICAL_SYMBOLS: string[] = ['⊥', '⊤', '¬', '∧', '∨', '→'];
export const FOL_SYMBOLS: string[] = [...LOGICAL_SYMBOLS, '∀', '∃'];

export const KEYWORD_TO_SYMBOLS: { [key: string]: { symbol: string; needsSpace: boolean } } = {
    'bot':   { symbol: '⊥', needsSpace: true },
    'top':   { symbol: '⊤', needsSpace: true },
    'not':   { symbol: '¬', needsSpace: false },
    '!':     { symbol: '¬', needsSpace: false },
    'and':   { symbol: '∧', needsSpace: true },
    '&&':    { symbol: '∧', needsSpace: true },
    'or':    { symbol: '∨', needsSpace: true },
    '||':    { symbol: '∨', needsSpace: true },
    'to':    { symbol: '→', needsSpace: true },
    '->':    { symbol: '→', needsSpace: true },
    'exist': { symbol: '∃', needsSpace: false },
    'all':   { symbol: '∀', needsSpace: false }
};


export const GROUPING_SYMBOLS: string[] = ['(', ')'];
export const GREEK_LETTERS: string[] = ['α', 'β', 'γ', 'δ', 'φ', 'ψ'];
export const MARKS_SYMBOLS = Array.from({length: 20}, (_, i) => (i + 1).toString());

export const SUB_TREE_SYMBOL = '𝒟'

export const KeyActionMap: Map<string, BoardAction> = new Map([
    ['Backspace', BoardAction.Delete],
    ['Delete', BoardAction.Delete],
    ['Ctrl+KeyZ', BoardAction.Undo],
    ['Ctrl+KeyY', BoardAction.Redo],
    ['Ctrl+KeyC', BoardAction.Copy],
    ['Ctrl+KeyV', BoardAction.Paste],
    ['Shift+Digit1', BoardAction.SwitchFOL],
    ['Shift+Digit2', BoardAction.SwitchHelp],
    ['Shift+Digit3', BoardAction.SwitchFeedbackLevel],
]);

export const MarksColorsArray: string[] = [
    '#001fed',
    '#1e1ea5',
    '#010442',
    '#8390f1',
    '#383e98',
    '#48484c',
    '#5e67ff',
    '#8390f1',
    '#5c608f',
    '#111a8a',
    '#69696a',
];
