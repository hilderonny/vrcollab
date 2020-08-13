import {Mesh, MeshBasicMaterial, PlaneGeometry, Texture, TextureLoader} from './three.module.js';

class LogPanel extends Mesh {

    constructor(width, height, rowCount, lineCount, backgroundColor, textColor) {
        super(
            new PlaneGeometry(width, height, 1, 1)
        );
        this.fontsize = 18;
        this.lines = [];
        var canvas = document.createElement('canvas');
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.rowCount = rowCount;
        this.lineCount = lineCount;
        this.canvasWidth =this.fontsize * this.rowCount / 1.8;
        this.canvasHeight = this.fontsize * this.lineCount;
        canvas.setAttribute('width', this.canvasWidth);
        canvas.setAttribute('height', this.canvasHeight);
        this.textcontext = canvas.getContext('2d');
	    this.textcontext.font = this.fontsize + 'px monospace';
        this.texture = new Texture(canvas) ;
        this.material = new MeshBasicMaterial({ map: this.texture, flatShading: true });
        LogPanel.lastPanel = this;
    }

    update() {
        this.textcontext.fillStyle = this.backgroundColor;
        this.textcontext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);        
        this.textcontext.fillStyle = this.textColor;
        for (var i = 0; i < this.lines.length; i++) {
            this.textcontext.fillText(this.lines[i], 0, this.fontsize * (i + .8) );
        }
    }

    log(val) {
        var text = '' + val;
        this.lines.push(...text.split('\n'));
        while(this.lines.length > this.lineCount) this.lines.shift();
        this.update();
        this.texture.needsUpdate = true;
    }

}

class MenuPanel extends Mesh {

    constructor(width, height) {
        super(
            new PlaneGeometry(width, height, 1, 1)
        );
        var loader = new TextureLoader();
        this.material = new MeshBasicMaterial({
            map: loader.load('lcars-demo-small.png'),
            flatShading: true,
        });        
    }

    update() {
    }

}

export { LogPanel, MenuPanel }