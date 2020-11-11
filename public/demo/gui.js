import { BufferAttribute, BufferGeometry, Mesh, MeshPhongMaterial, Object3D } from '../js/lib/three.module.js';
import { EventMesh } from './geometries.js';

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

class Button extends EventMesh {

    constructor(width, depth) {
        super(
            new BufferGeometry(),
            new MeshPhongMaterial({ color: 0xeb3bff, emissive: 0x421048 })
        );
        const vertices = new Float32Array([
            0.0,  0.0, 0.0,                     // 0
            width, -width, depth,               // 2
            1.0,  0.0, 0.0,                     // 1

            width, -width, depth,               // 2
            1.0 - width, -width, depth,         // 3
            1.0,  0.0, 0.0,                     // 1

            0.0,  0.0, 0.0,                     // 0
            0.0, -1.0, 0.0,                     // 6
            width, -width, depth,               // 2

            0.0, -1.0, 0.0,                     // 6
            width, width - 1.0, depth,          // 4
            width, -width, depth,               // 2

            0.0, -1.0, 0.0,                     // 6
            1.0 - width, width - 1.0, depth,    // 5
            width, width - 1.0, depth,          // 4

            0.0, -1.0, 0.0,                     // 6
            1.0, -1.0, 0.0,                     // 7
            1.0 - width, width - 1.0, depth,    // 5

            1.0 - width, width - 1.0, depth,    // 5
            1.0,  0.0, 0.0,                     // 1
            1.0 - width, -width, depth,         // 3

            1.0 - width, width - 1.0, depth,    // 5
            1.0, -1.0, 0.0,                     // 7
            1.0,  0.0, 0.0,                     // 1


            width, -width, depth,               // 2
            width, width - 1.0, depth,          // 4
            1.0 - width, -width, depth,         // 3

            width, width - 1.0, depth,          // 4
            1.0 - width, width - 1.0, depth,    // 5
            1.0 - width, -width, depth,         // 3

        ]);
        this.geometry.setAttribute('position', new BufferAttribute(vertices, 3));
        this.geometry.computeVertexNormals(); // Damit das Phong Material funktioniert, siehe https://stackoverflow.com/questions/47059946/buffergeometry-showing-up-as-black-with-phongmaterial
    }
}

class GuiButton extends Object3D {

    constructor() {
        super();
        var borderWidth = 0.1;
        var borderDepth = 0.3;
        var buttonTilt = 0.05;
        var buttonHeight = 0.4;
        this.buttonInset = 0.1;
        this.buttonInsetPressed = 0.3;
        this.add(new Border(borderWidth, borderDepth));
        this.button = new Button(buttonTilt, buttonHeight);
        this.button.scale.multiplyScalar(1 - ( 2 * borderWidth));
        this.button.position.x = borderWidth;
        this.button.position.y = -borderWidth;
        this.button.position.z = -this.buttonInset;
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
        this.button.position.z = -this.buttonInsetPressed;
    }

    handleButtonUp() {
        this.button.position.z = -this.buttonInset;
    }

}

class GuiToggleButton extends GuiButton {

    constructor() {
        super();
        this.currentButtonInset = this.buttonInset;
        this.shouldHandleUp = false;
    }

    handleButtonDown() {
        if (this.button.position.z === -this.buttonInset) {
            this.button.position.z = -this.buttonInsetPressed;
            this.shouldHandleUp = false;
        } else {
            this.shouldHandleUp = true;
        }
    }

    handleButtonUp() {
        if (!this.shouldHandleUp) return;
        if (this.button.position.z === -this.buttonInsetPressed) {
            this.button.position.z = -this.buttonInset;
            this.shouldHandleUp = false;
        }
    }
}

export { GuiButton, GuiToggleButton }
