/**
 * Uses PhantomJS, see https://github.com/amir20/phantomjs-node and http://phantomjs.org/
 */
var router = require('express').Router();
const phantom = require('phantom');

async function fetch(url, width, height) {
    const instance = await phantom.create();
    const page = await instance.createPage();

    await page.property('viewportSize', { width: width, height: height });

    const status = await page.open(url);
    const base64 = await page.renderBase64('png');

    await instance.exit();

    return new Buffer(base64, 'base64');
}

router.get('/', (req, res) => {
    var width = req.query.width ? req.query.width : 1280;
    var height = req.query.height ? req.query.height : 1024;
    var url = req.query.url;
    
    fetch(url, width, height).then((buffer) => {
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': buffer.length
        });
        res.end(buffer); 
    });
});

module.exports = router;