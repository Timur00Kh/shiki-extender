const express = require('express');
const app = express();
const path = require('path');
const args = require('minimist')(process.argv.slice(2));


const port = args.p || args.port || 8081;


app.use(express.json());
app.use(express.urlencoded({ extended: true })); // что за extended??
app.use('/altWatcher', require('./modules/altWatcher/altWatcher.js'));

/*Тут типо сервер стартовал*/
app.listen(port);
console.log("Server started at " + port);