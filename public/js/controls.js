import camera from './camera.js';

var mouseSpeed = 2;

var controls = {

    init: function (renderer) {
        var startX, startY, mouseDown;
        var mouseMove = function(e) {
            if (mouseDown) {
                var deltaX = e.clientX - startX;
                var deltaY = e.clientY - startY;
                var width = window.innerWidth, height = window.innerHeight, min = Math.min(width, height);
                camera.cam3.rotation.x += deltaY/min * mouseSpeed;
                camera.head.rotation.y += deltaX/min * mouseSpeed;
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
    },

};

export default controls;