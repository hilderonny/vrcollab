// Objekte speichern
var router = require('express').Router();
var fs = require('fs');
var path = require('path');

router.get('/', (_, res) => {
    var datadir = path.join(__dirname, '..', 'public', 'data', 'universes');
    var filenames = fs.readdirSync(datadir);
    res.send(filenames);
});

module.exports = router;