import { Object3D } from '../js/lib/three.module.js';
import { EventMesh, LogPanel } from './geometries.js';
import { GuiButton } from './gui.js';

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

class Keyboard extends Object3D {

    constructor() {
        super();
        for (let i = 0; i < keys.length; i++) {
            let row = keys[i];
            for (let j = 0; j < row.length; j++) {
                let key = row[j];
                const button = new GuiButton({ text: key.label ? key.label : key.value });
                button.key = key;
                button.addEventListener(EventMesh.EventType.ButtonDown, (button) => {
                    console.log(button, this);
                    LogPanel.lastPanel.log(button.key.value);
                });
                button.position.set(j, -i, 0);
                this.add(button);
            }
        }
    }
}

export { Keyboard }