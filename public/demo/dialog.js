import { EventMesh } from './geometries.js';
import { GuiButton, GuiToggleButton, GuiToggleButtonList } from './gui.js';

/**
 * Das ist kein abstrakter Dialog, sondern speziell für die Manipulation von 3D Objekten.
 * 
 * Events:
 * - 
 */
class ObjectManipulationDialog extends EventMesh {

    constructor() {
        super();
        this._screens = {};

        let screenToggleButtonList = new GuiToggleButtonList();
        let propertiesSubScreenToggleButtonList = new GuiToggleButtonList();

        // Home

        let homeScreen = {};
        homeScreen['LevelUpButton'] = this.createButton('⇧', 0, 0, 1, () => {});
        homeScreen['AddButton'] = this.createButton('✙', 5, 0, 1, () => {});

        let homeToggleButton = this.createToggleButton('☰', 0, 1, 1, () => { this.showScreen('Home'); })
        screenToggleButtonList.addToggleButton(homeToggleButton);
        homeScreen['ListButton00'] = this.createButton('', 1, 1, 2, () => {});
        homeScreen['ListButton10'] = this.createButton('', 3, 1, 2, () => {});
        homeScreen['UpButton'] = this.createButton('△', 5, 1, 1, () => {});

        screenToggleButtonList.addToggleButton(this.createToggleButton('🛈', 0, 2, 1, () => { 
            propertiesToggleButton.handleButtonDown(); // Ersten Unterscreen immer markieren
            this.showScreen('Properties');
        }));
        homeScreen['ListButton01'] = this.createButton('', 1, 2, 2, () => {});
        homeScreen['ListButton11'] = this.createButton('', 3, 2, 2, () => {});

        homeScreen['ListButton02'] = this.createButton('', 1, 3, 2, () => {});
        homeScreen['ListButton12'] = this.createButton('', 3, 3, 2, () => {});

        homeScreen['CopyButton'] = this.createButton('🗍', 0, 4, 1, () => {});
        homeScreen['ListButton03'] = this.createButton('', 1, 4, 2, () => {});
        homeScreen['ListButton13'] = this.createButton('', 3, 4, 2, () => {});

        homeScreen['DeleteButton'] = this.createButton('🗑', 0, 5, 1, () => {});
        homeScreen['ListButton04'] = this.createButton('', 1, 5, 2, () => {});
        homeScreen['ListButton14'] = this.createButton('', 3, 5, 2, () => {});
        homeScreen['DownButton'] = this.createButton('▽', 5, 5, 1, () => {});

        homeScreen['ScreenToggleButtonList'] = screenToggleButtonList;
        
        this._screens['Home'] = homeScreen;

        // Properties

        let propertiesScreen = {};

        let propertiesToggleButton = this.createToggleButton('🖺', 5, 1, 1, () => {
            this.showScreen('Properties');
        });
        propertiesSubScreenToggleButtonList.addToggleButton(propertiesToggleButton);
        propertiesSubScreenToggleButtonList.addToggleButton(this.createToggleButton('🡧', 5, 2, 1, () => { this.showScreen('Move'); }));
        propertiesSubScreenToggleButtonList.addToggleButton(this.createToggleButton('🗘', 5, 3, 1, () => { this.showScreen('Rotate'); }));
        propertiesSubScreenToggleButtonList.addToggleButton(this.createToggleButton('⤢', 5, 4, 1, () => { this.showScreen('Scale'); }));

        propertiesScreen['HasGeometryButton'] = this.createButton('🗹', 1, 2, 1, () => {});

        propertiesScreen['ScreenToggleButtonList'] = screenToggleButtonList;
        propertiesScreen['PropertiesSubScreenToggleButtonList'] = propertiesSubScreenToggleButtonList;
        
        this._screens['Properties'] = propertiesScreen;

        // Move

        let moveScreen = {};

        moveScreen['ScreenToggleButtonList'] = screenToggleButtonList;
        moveScreen['PropertiesSubScreenToggleButtonList'] = propertiesSubScreenToggleButtonList;
        
        this._screens['Move'] = moveScreen;

        // Rotate

        let rotateScreen = {};

        rotateScreen['ScreenToggleButtonList'] = screenToggleButtonList;
        rotateScreen['PropertiesSubScreenToggleButtonList'] = propertiesSubScreenToggleButtonList;
        
        this._screens['Rotate'] = rotateScreen;

        // Scale

        let scaleScreen = {};

        scaleScreen['ScreenToggleButtonList'] = screenToggleButtonList;
        scaleScreen['PropertiesSubScreenToggleButtonList'] = propertiesSubScreenToggleButtonList;
        
        this._screens['Scale'] = scaleScreen;

        // Vorauswahl

        propertiesToggleButton.handleButtonDown();
        homeToggleButton.handleButtonDown();
    }

    createButton(label = '', x = 0, y = 0, width = 1, clickListener) {
        const button = new GuiButton({
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

    createToggleButton(label = '', x = 0, y = 0, width = 1, clickListener) {
        const button = new GuiToggleButton({
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

    createTextOutput() {

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
   
}

ObjectManipulationDialog.EventType = {
    /**
     * Wird gesendet, wenn eine Taste gedrückt wurde.
     * Hat als Paramter den Wert der Taste
     */
    //KeyPressed: 'keyboardkeypressed',
};

export { ObjectManipulationDialog }