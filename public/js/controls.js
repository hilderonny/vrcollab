import {PointerLockControls} from './PointerLockControls.module.js';

import camera from './camera.js';
import environment from './environment.js';

var controls = {

    init: function (lockEl) {
        this.pointerLockControls = new PointerLockControls(camera.cam3, document.body);
        this.pointerLockControls.addEventListener('lock', function() {
            lockEl.classList.add('invisible');
        });
        this.pointerLockControls.addEventListener('unlock', function() {
            lockEl.classList.remove('invisible');
        });
        environment.scene.add( this.pointerLockControls.getObject() );
        lockEl.addEventListener('click', () => {
            this.pointerLockControls.lock();
        });
    },

};

export default controls;