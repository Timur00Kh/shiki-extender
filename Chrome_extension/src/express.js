const express = require('express');
const app = express();
const path = require('path');
const args = require('minimist')(process.argv.slice(2));

const port = args.p || args.port || 80;

app.use(express.static('public'));


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

app.get("/index", function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});


app.listen(port);
console.log("Server started at " + port);
