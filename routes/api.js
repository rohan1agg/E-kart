// Dependencies
var express = require('express');
var restful = require('node-restful');
var mysql = require('mysql');
var app = express();
var morgan = require('morgan');

app.use(express.static('./resources/WEB'));
app.use(morgan('short'));

// Routes
app.use('/ekartDb', require('../resources/db'));
app.use('/products', require('../resources/products'));
app.use('/category', require('../resources/category'));
app.use('/user', require('../resources/user'));
app.use('/order', require('../resources/order'));

module.exports = app;