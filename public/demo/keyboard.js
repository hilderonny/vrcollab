import { EventMesh } from './geometries.js';
import { GuiButton, GuiToggleButton } from './gui.js';

const keys = [
    [
        { value: '\'' }, // Ohne label wird value angezeigt
        { value: '!' },
        { value: '"' },
        { value: '§' },
        { value: '$' },
        { value: '%' },
        { value: '&' },
        { value: '?' },
        { value: '\\' },
        { value: '=' },
        { value: '+' },
        { value: '-' },
        { value: '*' },
        { value: '/' },
        { value: '#' },
        { value: '|' },
    ],
    [
        { label: '⇤', value: 'BACKTAB' },
        { value: '1' },
        { value: '2' },
        { value: '3' },
        { value: '4' },
        { value: '5' },
        { value: '6' },
        { value: '7' },
        { value: '8' },
        { value: '9' },
        { value: '0' },
        { value: 'ß' },
        { value: '[' },
        { value: ']' },
        { value: '^' },
        { value: '°' },
    ],
    [
        { label: '⇥', value: 'TAB' },
        { value: 'q', shift: { value: 'Q' } }, // Bei Shift-Taste oder Caps Lock wird das hier angezeigt
        { value: 'w', shift: { value: 'W' } },
        { value: 'e', shift: { value: 'E' } },
        { value: 'r', shift: { value: 'R' } },
        { value: 't', shift: { value: 'T' } },
        { value: 'z', shift: { value: 'Z' } },
        { value: 'u', shift: { value: 'U' } },
        { value: 'i', shift: { value: 'I' } },
        { value: 'o', shift: { value: 'O' } },
        { value: 'p', shift: { value: 'P' } },
        { value: 'ü', shift: { value: 'Ü' } },
        { value: '{' },
        { value: '}' },
        { value: '~' },
        { value: '@' },
    ],
    [
        { label: '⇪', value: 'CAPSLOCK' },
        { value: 'a', shift: { value: 'A' } },
        { value: 's', shift: { value: 'S' } },
        { value: 'd', shift: { value: 'D' } },
        { value: 'f', shift: { value: 'F' } },
        { value: 'g', shift: { value: 'G' } },
        { value: 'h', shift: { value: 'H' } },
        { value: 'j', shift: { value: 'J' } },
        { value: 'k', shift: { value: 'K' } },
        { value: 'l', shift: { value: 'L' } },
        { value: 'ö', shift: { value: 'Ö' } },
        { value: 'ä', shift: { value: 'Ä' } },
        { value: '(' },
        { value: ')' },
        { value: '`' },
        { value: '€' },
    ],
    [
        { label: '⇧', value: 'SHIFT' },
        { value: 'y', shift: { value: 'Y' } },
        { value: 'x', shift: { value: 'X' } },
        { value: 'c', shift: { value: 'C' } },
        { value: 'v', shift: { value: 'V' } },
        { value: 'b', shift: { value: 'B' } },
        { value: 'n', shift: { value: 'N' } },
        { value: 'm', shift: { value: 'M' } },
        { value: ',' },
        { value: '.' },
        { value: ':' },
        { value: ';' },
        { value: '<' },
        { value: '>' },
        { value: '´' },
        { value: '_' },
    ],
    [
        { label: 'Copy', value: 'COPY' },
        { label: 'Paste', value: 'PASTE' },
        { label: '␣', value: ' ', width: 9 }, // Breite der Taste in Relation zu Normalgröße
        { label: '↤', value: 'BACKSPACE', width: 2 },
        { label: '⏎', value: 'ENTER', width: 3 },
    ],
]

/**
 * Einstellungen:
 * - borderAmbientColor = 0xffeb3b,
 * - borderEmissiveColor = 0x421048,
 * - borderDepth = 1,
 * - borderWidth = .1,
 * - buttonAmbientColor = 0xeb3bff,
 * - buttonEmissiveColor = 0x421048,
 * - buttonHeight = .4,
 * - buttonInset = -.1,
 * - buttonInsetPressed = -.3,
 * - buttonTilt = .1,
 * 
 * Events:
 * - KeyPressed(value)
 */
class Keyboard extends EventMesh {

    constructor() {
        super();
        this._isShiftDown = false;
        this._isCapsLock = false;
        this._shiftButtons = [];
        this._shiftableButtons = [];
        this._buttons = [];
        for (let i = 0; i < keys.length; i++) {
            let row = keys[i];
            for (let j = 0, x = 0; j < row.length; j++) {
                const key = row[j];
                const width = key.width ? key.width : 1;
                const whichButton = ['SHIFT', 'CAPSLOCK'].includes(key.value) ? GuiToggleButton : GuiButton;
                const button = new whichButton({
                    borderWidth: .02,
                    text: (key.label ? key.label : key.value),
                    objectWidth: width,
                    textureWidth: width * 512,
                    borderAmbientColor: '#ccc',
                    borderEmissiveColor: '#000',
                    buttonAmbientColor: '#fff',
                    buttonEmissiveColor: '#000',
                    buttonHeight: .2,
                    buttonInset: -.05,
                    buttonInsetPressed: -.15,
                    borderDepth: .15,
                    buttonTilt: .04
                });
                button.key = key;
                button._button.bumpScale = -.0002;
                if (key.value === 'SHIFT') {
                    this._shiftButtons.push(button);
                    button.addEventListener(GuiButton.EventType.Pressed, () => {
                        this._isShiftDown = true;
                        for (let btn of this._shiftableButtons) {
                            btn.text = btn.key.shift.label ? btn.key.shift.label : btn.key.shift.value;
                        }
                    });
                    button.addEventListener(GuiButton.EventType.Released, () => {
                        this._isShiftDown = false;
                        if (!this._isCapsLock) {
                            for (let btn of this._shiftableButtons) {
                                btn.text = btn.key.label ? btn.key.label : btn.key.value;
                            }
                        }
                    });
                } else if (key.value === 'CAPSLOCK') {
                    button.addEventListener(GuiButton.EventType.Pressed, () => {
                        this._isCapsLock = true;
                        for (let btn of this._shiftableButtons) {
                            btn.text = btn.key.shift.label ? btn.key.shift.label : btn.key.shift.value;
                        }
                    });
                    button.addEventListener(GuiButton.EventType.Released, () => {
                        this._isCapsLock = false;
                        if (!this._isShiftDown) {
                            for (let btn of this._shiftableButtons) {
                                btn.text = btn.key.label ? btn.key.label : btn.key.value;
                            }
                        }
                    });
                } else {
                    button.addEventListener(GuiButton.EventType.Pressed, (button) => {
                        let value = ((this._isShiftDown || this._isCapsLock) && button.key.shift) ? button.key.shift.value : button.key.value;
                        if (this._isShiftDown) {
                            for (let shiftButton of this._shiftButtons) {
                                shiftButton.setPressed(false);
                            }
                        }
                        this.sendEvent(Keyboard.EventType.KeyPressed, value);
                    });
                }
                if (key.shift) {
                    this._shiftableButtons.push(button);
                }
                button.position.set(x, -i, 0);
                this._buttons.push(button);
                this.add(button);
                x += width;
            }
        }
    }

    set borderAmbientColor(value) { this._buttons.forEach(b => b.borderAmbientColor = value); }
    set borderEmissiveColor(value) { this._buttons.forEach(b => b.borderEmissiveColor = value); }
    set borderDepth(value) { this._buttons.forEach(b => b.borderDepth = value); }
    set borderWidth(value) { this._buttons.forEach(b => b.borderWidth = value); }
    set buttonAmbientColor(value) { this._buttons.forEach(b => b.buttonAmbientColor = value); }
    set buttonEmissiveColor(value) { this._buttons.forEach(b => b.buttonEmissiveColor = value); }
    set buttonHeight(value) { this._buttons.forEach(b => b.buttonHeight = value); }
    set buttonInset(value) { this._buttons.forEach(b => b.buttonInset = value); }
    set buttonInsetPressed(value) { this._buttons.forEach(b => b.buttonInsetPressed = value); }
    set buttonTilt(value) { this._buttons.forEach(b => b.buttonTilt = value); }
   
}

Keyboard.EventType = {
    /**
     * Wird gesendet, wenn eine Taste gedrückt wurde.
     * Hat als Paramter den Wert der Taste
     */
    KeyPressed: 'keyboardkeypressed',
};

export { Keyboard }