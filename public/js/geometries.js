import { BoxBufferGeometry, CylinderBufferGeometry, Mesh, MeshLambertMaterial, PlaneBufferGeometry, SphereBufferGeometry } from './lib/three.module.js';

/**
 * Enthält Standardgeometrien für Quader, Zylinder, Kugeln und Flächen
 */


class Cube extends Mesh {

    constructor() {
        super();
        this.geometry = new BoxBufferGeometry( 1, 1, 1 );
        this.material = new MeshLambertMaterial( {color: '#ddd'} );
        this.updateMorphTargets();
    }

}

class Cylinder extends Mesh {

    constructor() {
        super();
        this.geometry = new CylinderBufferGeometry( .5, .5, 1, 32 );
        this.material = new MeshLambertMaterial( {color: '#ddd'} );
        this.updateMorphTargets();
    }

}

class Plane extends Mesh {

    constructor() {
        super();
        this.geometry = new PlaneBufferGeometry( );
        this.material = new MeshLambertMaterial( {color: '#ddd'} );
        this.updateMorphTargets();
    }

}

class Sphere extends Mesh {

    constructor() {
        super();
        this.geometry = new SphereBufferGeometry( .5, 32, 16 );
        this.material = new MeshLambertMaterial( {color: '#ddd'} );
        this.updateMorphTargets();
    }

}


export { Cube, Cylinder, Plane, Sphere };