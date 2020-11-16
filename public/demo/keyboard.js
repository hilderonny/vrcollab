import { Object3D } from "../js/lib/three.module";

import { Object3D } from '../js/lib/three.module.js';
import { GuiButton } from './gui.js';

const keys = [
    [
        { label: '\'', value: '\'' },
    ],
    [
        { label: '|<--', value: 'BACKTAB' },
    ],
    [
        { label: '-->|', value: 'TAB' },
        { label: 'a', value: 'a', shift: { label: 'A', value: 'A' } },
    ],
    [],
    [
        { label: 'Copy', value: 'COPY' },
        { label: 'Paste', value: 'PASTE' },
        { label: '', value: ' ', width: 9 },
    ]
]

class Keyboard extends Object3D {

}

export { Keyboard }