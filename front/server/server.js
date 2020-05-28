const express = require("express");

const app = express();

let root = '../public/';

app.use(express.static('../public'));

app.listen(80);
