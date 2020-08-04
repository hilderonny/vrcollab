import camera from './camera.js';

var mouseSpeed = 2;
var moveSpeed = .1;

var controls = {
    
    forward: 0,
    sideward: 0,

    init: function (renderer) {
        var startX, startY, mouseDown;
        var mouseMove = function(e) {
            if (mouseDown) {
                var deltaX = e.clientX - startX;
                var deltaY = e.clientY - startY;
                var width = window.innerWidth, height = window.innerHeight, min = Math.min(width, height);
                camera.cam3.rotation.x -= deltaY/min * mouseSpeed;
                camera.head.rotation.y -= deltaX/min * mouseSpeed;
                startX = e.clientX; startY = e.clientY;
            }
        };
        renderer.domElement.addEventListener('mousedown', function(event) {
            // React only to right mouse button for movement
            if (event.button == 2) {
                startX = event.clientX; startY = event.clientY;
                mouseDown = true;
            }
        });
        renderer.domElement.addEventListener('mouseup', function() {
            if (event.button == 2) {
                mouseDown = false;
            }
        });
        renderer.domElement.addEventListener('contextmenu', function(event) {
            event.preventDefault();
        });
        renderer.domElement.addEventListener('mousemove', mouseMove);
        renderer.domElement.addEventListener('keydown', (event) => {
            switch(event.key) {
                case 'w': this.forward = -1; break;
                case 'a': this.sideward = -1; break;
                case 's': this.forward = 1; break;
                case 'd': this.sideward = 1; break;
            }
        });
        renderer.domElement.addEventListener('keyup', (event) => {
            switch(event.key) {
                case 'w': this.forward = 0; break;
                case 'a': this.sideward = 0; break;
                case 's': this.forward = 0; break;
                case 'd': this.sideward = 0; break;
            }
        });
        renderer.domElement.tabIndex = 0;
    },

    update: function() {
        if (this.forward !== 0) camera.head.translateZ(this.forward * moveSpeed);
        if (this.sideward !== 0) camera.head.translateX(this.sideward * moveSpeed);
    }

};

export default controls;