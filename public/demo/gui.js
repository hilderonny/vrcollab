import { BufferAttribute, BufferGeometry, CylinderBufferGeometry, Mesh, MeshPhongMaterial, Object3D, PlaneGeometry, TextureLoader } from '../js/lib/three.module.js';
import { EventMesh } from './geometries.js';

/**
 * Das ist der Rahmen eines GuiButtons.
 */
class Border extends Mesh {

    constructor(width, depth) {
        super(
            new BufferGeometry(),
            new MeshPhongMaterial({ color: 0xffeb3b, emissive: 0x484210 })
        );
        const vertices = new Float32Array([
            0.0,  0.0, 0.0,                     // 0
            width, -width, 0.0,                 // 2
            1.0,  0.0, 0.0,                     // 1

            width, -width, 0.0,                 // 2
            1.0 - width, -width, 0.0,           // 3
            1.0,  0.0, 0.0,                     // 1

            0.0,  0.0, 0.0,                     // 0
            0.0, -1.0, 0.0,                     // 6
            width, -width, 0.0,                 // 2

            0.0, -1.0, 0.0,                     // 6
            width, width - 1.0, 0.0,            // 4
            width, -width, 0.0,                 // 2

            0.0, -1.0, 0.0,                     // 6
            1.0 - width, width - 1.0, 0.0,      // 5
            width, width - 1.0, 0.0,            // 4

            0.0, -1.0, 0.0,                     // 6
            1.0, -1.0, 0.0,                     // 7
            1.0 - width, width - 1.0, 0.0,      // 5

            1.0 - width, width - 1.0, 0.0,      // 5
            1.0,  0.0, 0.0,                     // 1
            1.0 - width, -width, 0.0,           // 3

            1.0 - width, width - 1.0, 0.0,      // 5
            1.0, -1.0, 0.0,                     // 7
            1.0,  0.0, 0.0,                     // 1


            width, -width, 0.0,                 // 2
            width, -width, -depth,              // 8
            1.0 - width, -width, 0.0,           // 3

            width, -width, -depth,              // 8
            1.0 - width, -width, -depth,        // 9
            1.0 - width, -width, 0.0,           // 3

            width, width - 1.0, 0.0,            // 4
            width, width - 1.0, -depth,         // 10
            width, -width, 0.0,                 // 2

            width, width - 1.0, -depth,         // 10
            width, -width, -depth,              // 8
            width, -width, 0.0,                 // 2

            1.0 - width, width - 1.0, 0.0,      // 5
            1.0 - width, width - 1.0, -depth,   // 11
            width, width - 1.0, 0.0,            // 4

            1.0 - width, width - 1.0, -depth,   // 11
            width, width - 1.0, -depth,         // 10
            width, width - 1.0, 0.0,            // 4

            1.0 - width, -width, 0.0,           // 3
            1.0 - width, -width, -depth,        // 9
            1.0 - width, width - 1.0, 0.0,      // 5

            1.0 - width, -width, -depth,        // 9
            1.0 - width, width - 1.0, -depth,   // 11
            1.0 - width, width - 1.0, 0.0,      // 5

        ]);
        this.geometry.setAttribute('position', new BufferAttribute(vertices, 3));
        this.geometry.computeVertexNormals(); // Damit das Phong Material funktioniert, siehe https://stackoverflow.com/questions/47059946/buffergeometry-showing-up-as-black-with-phongmaterial
    }
}

/**
 * Der eigentliche Knopf in einem Gui-Button, der sich bewegt.
 */
class Button extends EventMesh {

    constructor(text, imageUrl, width, depth) {
        super(
            new BufferGeometry(),
            new MeshPhongMaterial(
                { color: 0xeb3bff, emissive: 0x421048, map: imageUrl ? new TextureLoader().load(imageUrl) : null }
            )
        );
        const vertices = new Float32Array([
            0.0,  0.0, 0.0,                 
            1.0,  0.0, 0.0,                 
            width, -width, depth,           
            1.0 - width, -width, depth,     
            width, width - 1.0, depth,      
            1.0 - width, width - 1.0, depth,
            0.0, -1.0, 0.0,                 
            1.0, -1.0, 0.0,                 
        ]);
        const uvcoords = new Float32Array([
            0.0, 1.0,
            1.0, 1.0,
            0.125, 0.875,
            0.875, 0.875,
            0.125, 0.125,
            0.875, 0.125,
            0.0, 0.0,
            1.0, 0.0,
        ]);
        const indices = [
            0, 2, 1,
            3, 1, 2,
            2, 3, 1,
            0, 6, 2,
            6, 4, 2,
            6, 5, 4,
            6, 7, 5,
            5, 1, 3,
            5, 7, 1,

            2, 4, 3,
            4, 5, 3,
        ];
        this.geometry.setAttribute( 'position', new BufferAttribute( vertices, 3 ) );
        this.geometry.setAttribute( 'uv', new BufferAttribute( uvcoords, 2 ) );
        this.geometry.setIndex(indices);
        this.geometry.computeVertexNormals(); // Damit das Phong Material funktioniert, siehe https://stackoverflow.com/questions/47059946/buffergeometry-showing-up-as-black-with-phongmaterial
    }
}

/**
 * Button mit Rahmen, den man drücken kann.
 * Der kommt wieder raus, wenn man loslässt.
 */
class GuiButton extends EventMesh {

    constructor(text, imageUrl) {
        super();
        var borderWidth = 0.1;
        var borderDepth = 0.3;
        var buttonTilt = 0.05;
        var buttonHeight = 0.4;
        this.buttonInset = 0.3;
        this.buttonInsetPressed = 0.1;
        this.add(new Border(borderWidth, borderDepth));
        this.button = new Button(text, imageUrl, buttonTilt, buttonHeight);
        this.button.scale.multiplyScalar(1 - ( 2 * borderWidth));
        this.button.position.x = .5;
        this.button.position.y = -.5;
        this.button.position.z = this.buttonInset;
        this.button.addEventListener(EventMesh.EventType.ButtonDown, () => {
            this.handleButtonDown();
        });
        this.button.addEventListener(EventMesh.EventType.ButtonUp, () => {
            this.handleButtonUp();
        });
        this.button.enableForRayCaster = true;
        this.add(this.button);
    }

    handleButtonDown() {
        this.setPressed(true);
    }

    handleButtonUp() {
        this.setPressed(false);
    }

    setPressed(pressed) {
        var isCurrentlyPressed = this.button.position.z === this.buttonInsetPressed;
        if (isCurrentlyPressed && !pressed) {
            this.button.position.z = this.buttonInset;
            this.sendEvent(GuiButton.EventType.Released);
        } else if (!isCurrentlyPressed && pressed) {
            this.button.position.z = this.buttonInsetPressed;
            this.sendEvent(GuiButton.EventType.Pressed);
        }
    }

}

GuiButton.EventType = {
    /**
     * Wird gesendet, wenn ein Button reingedrückt wurde, aber nicht, wenn er vorher schon gedrückt war
     */
    Pressed: 'guibuttonpressed',
    /**
     * Wird gesendet, wenn ein Button rausgedrückt oder losgelassen wurde
     */
    Released: 'guibuttonreleased',
};

/**
 * Umschalter-Button. Wenn man den drückt, bleibt er drin.
 * Drückt man nochmal, kommt er wieder raus.
 */
class GuiToggleButton extends GuiButton {

    constructor(text, imageUrl) {
        super(text, imageUrl);
        this.shouldHandleUp = false;
    }

    handleButtonDown() {
        if (this.button.position.z === this.buttonInset) {
            this.setPressed(true);
            this.shouldHandleUp = false;
        } else {
            this.shouldHandleUp = true;
        }
    }

    handleButtonUp() {
        if (!this.shouldHandleUp) return;
        if (this.button.position.z === this.buttonInsetPressed) {
            this.setPressed(false);
            this.shouldHandleUp = false;
        }
    }
}

/**
 * Liste von Toggle-Buttons, die sich gegensetig bedingen.
 * Drückt man einen, kommen die anderen raus.
 */
class GuiToggleButtonList extends Object3D {

    constructor() {
        super();
        this.buttonList = [];
    }

    addToggleButton(button) {
        var buttonList = this.buttonList;
        button.handleButtonDown = function() { // Drücken "entdrückt" alle anderen Buttons
            for (var b of buttonList) {
                b.setPressed(b === this);
            }
        }
        button.handleButtonUp = () => {}; // Button kann nicht direkt deaktiviert werden
        this.buttonList.push(button);
        this.add(button);
    }

}

export { GuiButton, GuiToggleButton, GuiToggleButtonList }
