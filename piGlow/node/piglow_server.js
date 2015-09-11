var piGlow = require('piglow');
var fs = require('fs');

var express = require('express');
var app = express();
app.listen(8081);
console.log('Server started - Listening on 8081');

app.use('/css/', express.static('css'));

piGlow(function (error, pi) { pi.reset; });

var glow = [{ "id": "l_0_0", "color": "red" },
{ "id": "l_0_1", "color": "orange", "level": 0 },
{ "id": "l_0_2", "color": "yellow", "level": 0 },
{ "id": "l_0_3", "color": "green", "level": 0 },
{ "id": "l_0_4", "color": "blue", "level": 0 },
{ "id": "l_0_5", "color": "white", "level": 0 },
{ "id": "l_1_0", "color": "red", "level": 0 },
{ "id": "l_1_1", "color": "orange", "level": 0 },
{ "id": "l_1_2", "color": "yellow", "level": 0 },
{ "id": "l_1_3", "color": "green", "level": 0 },
{ "id": "l_1_4", "color": "blue", "level": 0 },
{ "id": "l_1_5", "color": "white", "level": 0 },
{ "id": "l_2_0", "color": "red", "level": 0 },
{ "id": "l_2_1", "color": "orange", "level": 0 },
{ "id": "l_2_2", "color": "yellow", "level": 0 },
{ "id": "l_2_3", "color": "green", "level": 0 },
{ "id": "l_2_4", "color": "blue", "level": 0 },
{ "id": "l_2_5", "color": "white", "level": 0 }];

function updateGlow() {
    piGlow(function (error, pi) {
        pi.startTransaction();
        pi.l_0_0 = glow[0].level
        pi.l_0_1 = glow[1].level
        pi.l_0_2 = glow[2].level
        pi.l_0_3 = glow[3].level
        pi.l_0_4 = glow[4].level
        pi.l_0_5 = glow[5].level
        pi.l_1_0 = glow[6].level
        pi.l_1_1 = glow[7].level
        pi.l_1_2 = glow[8].level
        pi.l_1_3 = glow[9].level
        pi.l_1_4 = glow[10].level
        pi.l_1_5 = glow[11].level
        pi.l_2_0 = glow[12].level
        pi.l_2_1 = glow[13].level
        pi.l_2_2 = glow[14].level
        pi.l_2_3 = glow[15].level
        pi.l_2_4 = glow[16].level
        pi.l_2_5 = glow[17].level
        pi.commitTransaction();
    });
}



/* ########## ROUTING ##########*/

app.all('/api/*', function (req, res, next) {
    var currentDate = new Date().toString();
    console.log(currentDate + " | " + req.ip + " | " + req.protocol + " | " + req.hostname + " | " + req.originalUrl);
    next();
});

app.get('/', function (req, res) {
    fs.readFile('index.html', function (error, data) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
});


app.get('/api/v2.0.1/reset', function (req, res) {
    res.writeHead(200);
    piGlow(function (error, pi) { pi.reset; });
    res.end();
    for (i = 0; i < glow.length; i++) {
        glow[i].level = 0;
    };
    updateGlow();
});

app.get('/api/v2.0.1/light', function (req, res) {    
    res.writeHead(200);
    res.end();

    /*for all LEDs of color, change the brightness level*/
    for (i = 0; i < glow.length; i++) {
        if (glow[i].color === req.query.color) {
            glow[i].level = req.query.level;
        };
    };
    updateGlow();
});

app.get('/api/v2.0.1/status', function (req, res) {
    res.send(glow);
    res.end();
});

/* ########## API 2.0.0 ##########*/

app.get('/api/v2.0.0/reset', function (req, res) {
    res.writeHead(200);
    piGlow(function (error, pi) { pi.reset; });
    res.end();
    for (i = 0; i < glow.length; i++) {
        glow[i].level = 0;
    };
    updateGlow();

    console.log('Reset');
});

app.get('/api/v2.0.0/light', function (req, res) {
    console.log(req.query.color);
    console.log(req.query.level);
    res.writeHead(200);
    res.end();
    /*for all LEDs of color, change the brightness level*/

    for (i = 0; i < glow.length; i++) {
        if (glow[i].color === req.query.color) {
            glow[i].level = req.query.level;
        };
    };
    updateGlow();

});

app.get('/api/v2.0.0/status', function (req, res) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.send(glow);
    res.end();
});








/* ########## API 1.0.0 ##########*/
app.get('/api/v1.0.0/', function (req, res) {

    console.log(req.query.led);
    console.log(req.query.level);
    res.writeHead(200);
    switch (req.query.led) {
        case 'red':
            piGlow(function (error, pi) { pi.red = req.query.level; });
            break;
        case 'yellow':
            piGlow(function (error, pi) { pi.yellow = req.query.level; });
            break;
        case 'blue':
            piGlow(function (error, pi) { pi.blue = req.query.level; });
            break;
        case 'green':
            piGlow(function (error, pi) { pi.green = req.query.level; });
            break;
        case 'white':
            piGlow(function (error, pi) { pi.white = req.query.level; });
            break;
        case 'orange':
            piGlow(function (error, pi) { pi.orange = req.query.level; });
            break;
        default:
            piGlow(function (error, pi) { pi.all = req.query.level; });
            break;
    }
    res.end();
    console.log(req.query.led + ' ' + req.query.level);
});

app.get('/api/v1.0.0/reset', function (req, res) {
    res.writeHead(200);
    piGlow(function (error, pi) { pi.reset; });
    res.end();
    console.log('Reset');
});

app.get('/api/v1.0.1/', function (req, res) {

    console.log(req.query.led);
    console.log(req.query.level);
    res.writeHead(200);
    switch (req.query.led) {
        case 'red':
            piGlow(function (error, pi) { pi.red = req.query.level; });
            break;
        case 'yellow':
            piGlow(function (error, pi) { pi.yellow = req.query.level; });
            break;
        case 'blue':
            piGlow(function (error, pi) { pi.blue = req.query.level; });
            break;
        case 'green':
            piGlow(function (error, pi) { pi.green = req.query.level; });
            break;
        case 'white':
            piGlow(function (error, pi) { pi.white = req.query.level; });
            break;
        case 'orange':
            piGlow(function (error, pi) { pi.orange = req.query.level; });
            break;
        default:
            piGlow(function (error, pi) { pi.all = req.query.level; });
            break;
    }
    res.end();
    console.log(req.query.led + ' ' + req.query.level);
});