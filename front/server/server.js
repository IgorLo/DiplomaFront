const express = require("express");
const app = express();
let root = '../public/';

app.get("*/app.bundle.js", function (req, res) {
    res.sendFile('app.bundle.js', {root: root})
});
app.get("*/index.css", function (req, res) {
    res.sendFile('index.css', {root: root})
});
app.get("/*", function (req, res) {
    res.sendFile('index.html', {root: root})
});

app.use(express.static('../public'));
app.listen(80);
