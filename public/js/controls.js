import camera from './camera.js';

var controls = {

    init: function (renderer) {
        var startX, startY;
        var mouseMove = function(e) {
            var deltaX = e.clientX - startX;
            var deltaY = e.clientY - startY;
            var width = window.innerWidth, height = window.innerHeight, min = Math.min(width, height);
            camera.cam3.rotation.x += deltaY/min;
            camera.cam3.rotation.y += deltaX/min;
            startX = e.clientX; startY = e.clientY;
        };
        renderer.domElement.addEventListener('mousedown', function(e) {
            renderer.domElement.addEventListener('mousemove', mouseMove);
            startX = e.clientX; startY = e.clientY;
            e.preventDefault();
		    e.stopPropagation();
        });
        renderer.domElement.addEventListener('mouseup', function(e) {
            renderer.domElement.removeEventListener('mousemove', mouseMove);
        });
    },

};

export default controls;