import { EventMesh } from './geometries.js';
import { CheckBoxGuiToggleButton, GuiButton, GuiTextInput, GuiTextOutput, GuiToggleButton, GuiToggleButtonList } from './gui.js';

/**
 * Das ist kein abstrakter Dialog, sondern speziell für die Manipulation von 3D Objekten.
 * 
 * Events:
 * - 
 */
class ObjectManipulationDialog extends EventMesh {

    constructor(rootObject) {
        super();
        let screenToggleButtonList = new GuiToggleButtonList([
            this.createToggleButton('Hierarchie', 0, 1, 1, () => { this.showScreen('Home'); }),
            this.createToggleButton('Eigenschaften', 0, 2, 1, () => { 
                propertiesSubScreenToggleButtonList.children[0].handleButtonDown(); // Ersten Unterscreen immer markieren
                this.showScreen('Properties');
            }),
        ]);
        let propertiesSubScreenToggleButtonList = new GuiToggleButtonList([
            this.createToggleButton('Allgemein', 5, 1, 1, () => { this._propertiesMode = ObjectManipulationDialog.PropertiesMode.General; this.showScreen('Properties'); }),
            this.createToggleButton('Bewegen', 5, 2, 1, () => { this._propertiesMode = ObjectManipulationDialog.PropertiesMode.Move; this.showScreen('Move'); }),
            this.createToggleButton('Rotieren', 5, 3, 1, () => { this._propertiesMode = ObjectManipulationDialog.PropertiesMode.Rotate; this.showScreen('Rotate'); }),
            this.createToggleButton('Skalieren', 5, 4, 1, () => { this._propertiesMode = ObjectManipulationDialog.PropertiesMode.Scale; this.showScreen('Scale'); }),
        ]);
        let coordinatesToggleButtonList = new GuiToggleButtonList([
            this.createToggleButton('X', 1, 1, 1, () => { this._manipulationAxis = ObjectManipulationDialog.ManipulationAxis.X }),
            this.createToggleButton('Y', 1, 2, 1, () => { this._manipulationAxis = ObjectManipulationDialog.ManipulationAxis.Y }),
            this.createToggleButton('Z', 1, 3, 1, () => { this._manipulationAxis = ObjectManipulationDialog.ManipulationAxis.Z }),
        ]);
        let geometriesToggleButtonList = new GuiToggleButtonList([
            this.createToggleButton('Keine Geometrie', 1, 2, 1, () => { }),
            this.createToggleButton('Würfel', 2, 2, 1, () => { }),
            this.createToggleButton('Zylinder', 3, 2, 1, () => { }),
            this.createToggleButton('Platte', 4, 2, 1, () => { }),
        ]);
        let manipulateButtons = new EventMesh();
        manipulateButtons.add(...[
            this.createButton('+10', 1, 4, 1, () => { this.manipulate(10); }),
            this.createButton('+1', 2, 4, 1, () => { this.manipulate(1); }),
            this.createButton('+0,1', 3, 4, 1, () => { this.manipulate(.1); }),
            this.createButton('+0,01', 4, 4, 1, () => { this.manipulate(.01); }),
            this.createButton('-10', 1, 5, 1, () => { this.manipulate(-10); }),
            this.createButton('-1', 2, 5, 1, () => { this.manipulate(-1); }),
            this.createButton('-0,1', 3, 5, 1, () => { this.manipulate(-.1); }),
            this.createButton('-0,01', 4, 5, 1, () => { this.manipulate(-.01); }),
        ]);
        this._childrenList = new EventMesh();
        this._childrenList.add(...[
            this.createButton('', 1, 1, 2, button => this.handleChildButtonClick(button)),
            this.createButton('', 3, 1, 2, button => this.handleChildButtonClick(button)),
            this.createButton('', 1, 2, 2, button => this.handleChildButtonClick(button)),
            this.createButton('', 3, 2, 2, button => this.handleChildButtonClick(button)),
            this.createButton('', 1, 3, 2, button => this.handleChildButtonClick(button)),
            this.createButton('', 3, 3, 2, button => this.handleChildButtonClick(button)),
            this.createButton('', 1, 4, 2, button => this.handleChildButtonClick(button)),
            this.createButton('', 3, 4, 2, button => this.handleChildButtonClick(button)),
            this.createButton('', 1, 5, 2, button => this.handleChildButtonClick(button)),
            this.createButton('', 3, 5, 2, button => this.handleChildButtonClick(button)),
        ]);

        this._currentLevelOutput = this.createTextOutput('Das ist kein abstrakter Dialog, sondern speziell für die Manipulation von 3D Objekten. Das ist kein abstrakter Dialog, sondern speziell für die Manipulation von 3D Objekten.', 1, 0, 4, 1, true, '/images/paper-bg-1.png');
        this._selectedPageOutput = this.createTextOutput('', 5, 2, 1, 3, true, null, '#fff', .07);
        this._nameOutput = this.createTextInput('', 2, 1, 3, 1, '/images/zahnradrahmen.png', '#fff', .2, (_, text) => {
            this._selectedObject.name = text;
            this.updateHierarchy();
        });
        this._xOutput = this.createTextOutput('', 2, 1, 3, 1, true, null, '#fff', .5);
        this._yOutput = this.createTextOutput('', 2, 2, 3, 1, true, null, '#fff', .5);
        this._zOutput = this.createTextOutput('', 2, 3, 3, 1, true, null, '#fff', .5);

        this._screens = {
            Home: [
                this.createButton('Ebene\nhoch', 0, 0, 1, () => {
                    if (this._selectedObject && this._selectedObject.parent) {
                        this.selectObject(this._selectedObject.parent);
                    }
                }),
                this._currentLevelOutput,
                this.createButton('Neues\nObjekt', 5, 0, 1, () => {}),
                screenToggleButtonList,
                this._childrenList,
                this.createButton('Vorherige\nSeite', 5, 1, 1, () => {
                    if (this._currentOffset > 0) {
                        this.showChildren(this._currentOffset - 10);
                    }
                }),
                this._selectedPageOutput,
                this.createTextOutput('', 0, 3, 1),
                this.createButton('Duplizieren', 0, 4, 1, () => {}),
                this.createButton('Löschen', 0, 5, 1, () => {}),
                this.createButton('Nächste\nSeite', 5, 5, 1, () => {
                    if (this._currentOffset < (this._filteredChildren.length - 10)) {
                        this.showChildren(this._currentOffset + 10);
                    }
                }),
            ],
            Properties: [
                screenToggleButtonList,
                propertiesSubScreenToggleButtonList,
                geometriesToggleButtonList,

                this.createTextOutput('', 0, 0, 1),
                this._currentLevelOutput,
                this.createTextOutput('', 5, 0, 1),

                this.createTextOutput('Name', 1, 1, 1, 1, true, null, '#fd0', .2),
                this._nameOutput,

                this.createTextOutput('', 0, 3, 1, 3),
                this.createTextOutput('Ambiente\nFarbe', 1, 3, 1, 1, true, null, '#fd0', .2),
                this.createTextInput('#888', 2, 3, 3, 1, '/images/zahnradrahmen.png', '#fff', .2, () => { }),

                this.createTextOutput('Leucht-\nfarbe', 1, 4, 1, 1, true, null, '#fd0', .2),
                this.createTextInput('#666', 2, 4, 3, 1, '/images/zahnradrahmen.png', '#fff', .2, () => { }),

                this.createTextOutput('', 1, 5, 5),
            ],
            Move: [
                screenToggleButtonList,
                propertiesSubScreenToggleButtonList,
                coordinatesToggleButtonList,
                manipulateButtons,

                this._xOutput,
                this._yOutput,
                this.createTextOutput('', 0, 3, 1, 3),
                this._zOutput,

                this.createTextOutput('', 0, 0, 1),
                this._currentLevelOutput,
                this.createTextOutput('', 5, 0, 1),
                
                this.createTextOutput('', 5, 5, 1, 1),
            ],
            Rotate: [
                screenToggleButtonList,
                propertiesSubScreenToggleButtonList,
                coordinatesToggleButtonList,
                manipulateButtons,
                
                this._xOutput,
                this._yOutput,
                this.createTextOutput('', 0, 3, 1, 3),
                this._zOutput,

                this.createTextOutput('', 0, 0, 1),
                this._currentLevelOutput,
                this.createTextOutput('', 5, 0, 1),
                
                this.createTextOutput('', 5, 5, 1, 1),
            ],
            Scale: [
                screenToggleButtonList,
                propertiesSubScreenToggleButtonList,
                coordinatesToggleButtonList,
                manipulateButtons,
                
                this._xOutput,
                this._yOutput,
                this.createTextOutput('', 0, 3, 1, 3),
                this._zOutput,

                this.createTextOutput('', 0, 0, 1),
                this._currentLevelOutput,
                this.createTextOutput('', 5, 0, 1),
                
                this.createTextOutput('', 5, 5, 1, 1),
            ],
        };

        // Vorauswahl

        propertiesSubScreenToggleButtonList.children[0].handleButtonDown();
        screenToggleButtonList.children[0].handleButtonDown();
        coordinatesToggleButtonList.children[0].handleButtonDown();
        geometriesToggleButtonList.children[0].handleButtonDown();

        this.rootObject = rootObject;
    }

    _createButton(type, label, x, y, width, clickListener) {
        const button = new type({
            borderWidth: .02,
            text: label,
            objectWidth: width,
            textureWidth: width * 512,
            borderAmbientColor: '#333',
            borderEmissiveColor: '#000',
            buttonAmbientColor: '#600',
            buttonEmissiveColor: '#000',
            buttonHeight: .2,
            buttonInset: -.05,
            buttonInsetPressed: -.15,
            borderDepth: .15,
            buttonTilt: .04,
        });
        button.position.set(x, -y, 0);
        button._button.bumpScale = .001;
        button._button.textColor = '#fd0';
        button.addEventListener(GuiButton.EventType.Pressed, clickListener);
        return button;
    }

    createButton(label = '', x = 0, y = 0, width = 1, clickListener) {
        return this._createButton(GuiButton, label, x, y, width, clickListener);
    }

    createCheckBoxToggleButton(x = 0, y = 0, width = 1, clickListener) {
        return this._createButton(CheckBoxGuiToggleButton, null, x, y, width, clickListener);
    }

    createToggleButton(label = '', x = 0, y = 0, width = 1, clickListener) {
        return this._createButton(GuiToggleButton, label, x, y, width, clickListener);
    }

    createTextInput(text = '', x = 0, y = 0, width = 1, height = 1, imageUrl = null, textColor = '#000', fontSize = .2, changedListener) {
        let textInput = new GuiTextInput({
            ambientColor: '#333',
            emissiveColor: '#000',
            textColor: textColor,
            text: text,
            fontSize: fontSize,
            objectWidth: width,
            objectHeight: height,
            imageUrl: imageUrl,
            center: true,
            padding: .2,
        });
        textInput.position.set(x, -y, 0);
        textInput.bumpScale = -.0005;
        textInput.addEventListener(GuiTextInput.EventType.Changed, changedListener);
        return textInput;
    }

    createTextOutput(text = '', x = 0, y = 0, width = 1, height = 1, center = false, imageUrl = null, textColor = '#000', fontSize = .15) {
        let textOutput = new GuiTextOutput({
            ambientColor: '#333',
            emissiveColor: '#000',
            textColor: textColor,
            text: text,
            fontSize: fontSize,
            padding: .05,
            objectWidth: width,
            objectHeight: height,
            center: center,
            imageUrl: imageUrl,
        });
        textOutput.position.set(x, -y, 0);
        textOutput.bumpScale = -.0005;
        return textOutput;
    }

    handleChildButtonClick(childButton) {
        this.selectObject(childButton.targetObject);
    }

    manipulate(value) {
        let newValue;
        switch(this._propertiesMode) {
            case ObjectManipulationDialog.PropertiesMode.Move:
                switch (this._manipulationAxis) {
                    case ObjectManipulationDialog.ManipulationAxis.X:
                        newValue = this._selectedObject.position.x + value;
                        this._selectedObject.position.setX(newValue);
                        this.showX(newValue);
                        break;
                    case ObjectManipulationDialog.ManipulationAxis.Y:
                        newValue = this._selectedObject.position.y + value;
                        this._selectedObject.position.setY(newValue);
                        this.showY(newValue);
                        break;
                    case ObjectManipulationDialog.ManipulationAxis.Z:
                        newValue = this._selectedObject.position.z + value;
                        this._selectedObject.position.setZ(newValue);
                        this.showZ(newValue);
                        break;
                }
                break;
        }
    }

    showScreen(screenName) {
        this.children.forEach(child => child.enableForRayCaster = false);
        this.remove(...this.children);
        Object.values(this._screens[screenName]).forEach(child => {
            child.enableForRayCaster = true;
            this.add(child);
        });
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
    set buttonTextColor(value) { this._buttons.forEach(b => b._button.textColor = value); }
    set buttonTilt(value) { this._buttons.forEach(b => b.buttonTilt = value); }
   
    set rootObject(value) {
        this._rootObject = value;
        this.selectObject(this._rootObject);
    }

    /**
     * Wählt ein Objekt unterhalb des Root Objektes zur Bearbeitung aus.
     * Muss eine EventMesh sein. Warum? Halt so.
     * 
     * TODO: dem Objekt als Kind einen Wireframe-Würfel (Keine EventMesh) zuweisen,
     * der dessen Abgrenzungen und Selektion visualisiert
     */
    selectObject(object) {
        this._selectedObject = object;
        // Info-Panel mit Hierarchie aktualisieren
        this.updateHierarchy();
        // Kind-Elemente auflisten, nur die ersten 10 anzeigen
        this._filteredChildren = object.children.filter(c => c instanceof EventMesh);
        this.showChildren(0);
        // Eigenschaftsseite
        // Name auf Eigenschaftsseite
        this._nameOutput.text = object.name;
        // Position
        this.showX(object.position.x);
        this.showY(object.position.y);
        this.showZ(object.position.z);
        // Rotation
        // Skalierung
        // Geometrietyp
        // Ambiente Farbe
        // Leuchtfarbe
    }

    showX(value) { this._xOutput.text = value.toFixed(2); }
    showY(value) { this._yOutput.text = value.toFixed(2); }
    showZ(value) { this._zOutput.text = value.toFixed(2); }

    updateHierarchy() {
        let text = '';
        let currentObject = this._selectedObject;
        do {
            let name = currentObject.name || ('[' + currentObject.constructor.name + ']');
            if (text) text = ' > ' + text;
            text = name + text;
            currentObject = currentObject.parent;
        } while(currentObject);
        this._currentLevelOutput.text = text;
    }

    showChildren(offset) {
        this._currentOffset = offset;
        // Kinder-Buttons
        this._childrenList.children.forEach(btn => {
            btn.text = '';
            btn.targetObject = null;
        });
        for (let i = offset, j = 0; i < this._filteredChildren.length && j < 10; i++, j++) {
            let child = this._filteredChildren[i];
            let listButton = this._childrenList.children[j];
            listButton.text = child.name || ('[' + child.constructor.name + ']');
            listButton.targetObject = child; // Für Klick-Handler
        }
        // Paging-Anzeige
        let currentPage = this._currentOffset / 10 + 1;
        let pageCount = Math.ceil(this._filteredChildren.length / 10) || 1;
        this._selectedPageOutput.text = 'Seite\n' + currentPage + ' / ' + pageCount;
    }
}

ObjectManipulationDialog.ManipulationAxis = {
    X: 'ObjectManipulationDialog.ManipulationAxis.X',
    Y: 'ObjectManipulationDialog.ManipulationAxis.Y',
    Z: 'ObjectManipulationDialog.ManipulationAxis.Z',
}

ObjectManipulationDialog.PropertiesMode = {
    General: 'ObjectManipulationDialog.PropertiesMode.General',
    Move: 'ObjectManipulationDialog.PropertiesMode.Move',
    Rotate: 'ObjectManipulationDialog.PropertiesMode.Rotate',
    Scale: 'ObjectManipulationDialog.PropertiesMode.Scale',
}

export { ObjectManipulationDialog }