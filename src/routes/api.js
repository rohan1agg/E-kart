// Dependencies
// var express = require('express')
import express from 'express'
// change require by import
// as a convention requires should be at the top of file only
// study why imports should be at top level of the file
// example - the following wont work - find out why
/*
* function () {
*   import ekartDB from '../resources/db'
* }
*
*   */
import eKartDB from '../resources/db'
import products from '../resources/products'
import category from '../resources/category'
import user from '../resources/user'
import order from '../resources/order'
// commeting these two lines
// var restful = require('node-restful');
// var mysql = require('mysql');
var app = express()

// Routes
app.use('/ekartDb', eKartDB)
app.use('/products', products)
app.use('/category', category)
app.use('/user', user)
app.use('/order', order)

// replace module.exports = app by export default app
export default app
// read difference between default export and named exports