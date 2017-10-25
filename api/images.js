var router = require('express').Router();
var fs = require('fs');
var path = require('path');

router.get('/', (req, res) => {
    var imagedir = path.join(__dirname, '..', 'public', 'images');
    var filenames = fs.readdirSync(imagedir);
    res.send(filenames);
});

module.exports = router;