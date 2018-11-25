import express from 'express'
import mysql from 'mysql'

// var express = require('express');
// var mysql = require('mysql');
// const bodyParser = require("body-parser");

// replace var with const - read about difference between var, const, let
let ekartDb = express.Router()

// Express - body parser - required just once (inititized in index.js)
// ekartDb.use(bodyParser.urlencoded({ extended: true }));
// ekartDb.use(bodyParser.json());
import getConnection from './dbconnection'
const conPool = getConnection()

// ekartDb.post('/alter', (req, res)=>{
// 	if(req.body.adminID!=='root' && req.body.password!=='rohan296'){
// 		res.send("Invalid Credentials!\nAccess Denied!");
// 		return;
// 	}
// 	var sql = 'ALTER TABLE user_orders MODIFY COLUMN order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
// 	conPool.query(sql, (err, result)=>{
// 		res.send('Table user_orders altered!');
// 	});
// });

ekartDb.post('/reCreate', (req, res) => {
  if (req.body.adminID !== 'root' && req.body.password !== 'rohan296') {
    res.send('Invalid Credentials!\nAccess Denied!')
    // should send http error code 401 here
    return
  }
  var sql = 'DROP DATABASE ekart'
  conPool.query(sql, function (err, result) {
    if (err) {
      // learn about standard HTTP status codes like 200: success, 301: permanent redirect, 302: temporary redirect, 400: bad required, 401: unauthorized, 422: unprocessable entity, 500: internal server error etc
      res.sendStatus(500)
      res.end()
      console.log(err)
      return
    }
    console.log('ekart dropped!')
  })
  // learn about loading configurations from a config file / env variables - ideally configs are kept in .env or .json files and sensititve information like passwords are provided in process.env variables
  var con1 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rohan296',
  })

  con1.connect(function (err) {
    if (err) throw err
    console.log('Connected to MySQl Server!')
    con1.query('CREATE DATABASE ekart', function (err, result) {
      if (err) {
        res.send('DB deleted but not createdd!')
        console.log('Error Incured')
        throw err
      }
      console.log('Database ekart created')
      con = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'rohan296',
        database: 'ekart'
      })
      // read about flyway or other db migration tools and try to implement them
      // learn about ORM tools like sequalize
      var sql
      sql = 'CREATE TABLE users (user_id INT NOT NULL, user_name VARCHAR(100), password VARCHAR(50), mobile_no VARCHAR(10) NOT NULL, address VARCHAR(250), email_id VARCHAR(50) NOT NULL, PRIMARY KEY(user_id))'
      con.query(sql, function (err, result) {
        if (err) throw err
        console.log('Users table created!')
      })
      sql = 'CREATE TABLE category (category_no INT NOT NULL AUTO_INCREMENT, category_name VARCHAR(100) UNIQUE, PRIMARY KEY(category_no))'
      con.query(sql, function (err, result) {
        if (err) throw err
        console.log('Category table created!')
      })
      sql = 'CREATE TABLE products (product_id INT NOT NULL AUTO_INCREMENT, product_name VARCHAR(100), brand_name VARCHAR(50), category_no INT NOT NULL, product_info TEXT, avg_rating INT(1), product_status INT, price INT NOT NULL, PRIMARY KEY(product_id), FOREIGN KEY (category_no) REFERENCES category(category_no))'
      con.query(sql, function (err, result) {
        if (err) throw err
        console.log('Products table created!')
      })
      sql = 'CREATE TABLE user_orders (order_id INT AUTO_INCREMENT, user_id INT NOT NULL, order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, order_amount INT NOT NULL, order_status VARCHAR(100), PRIMARY KEY(order_id), FOREIGN KEY (user_id) REFERENCES users(user_id))'
      con.query(sql, function (err, result) {
        if (err) throw err
        console.log('user_orders table created!')
      })
      sql = 'CREATE TABLE dealers (dealer_id INT NOT NULL, dealer_name VARCHAR(100) NOT NULL, password VARCHAR(50) NOT NULL, address VARCHAR(200) NOT NULL, mobile_no VARCHAR(10) NOT NULL, avg_rating INT(5) DEFAULT 3, email_id VARCHAR(50) NOT NULL, PRIMARY KEY(dealer_id))'
      con.query(sql, function (err, result) {
        if (err) throw err
        console.log('dealers table created!')
      })
      sql = 'CREATE TABLE order_contents (order_id INT NOT NULL, product_id INT NOT NULL, dealer_id INT NOT NULL, FOREIGN KEY (order_id) REFERENCES user_orders(order_id), FOREIGN KEY (product_id) REFERENCES products(product_id), FOREIGN KEY (dealer_id) REFERENCES dealers(dealer_id), CONSTRAINT order_item PRIMARY KEY (order_id, product_id, dealer_id))'
      con.query(sql, function (err, result) {
        if (err) throw err
        console.log('order_contents table created!')
      })
      sql = 'CREATE TABLE user_cart (user_id INT NOT NULL, product_id INT NOT NULL,  dealer_id INT NOT NULL, quantity INT(2) NOT NULL, FOREIGN KEY (user_id) REFERENCES users(user_id), FOREIGN KEY (product_id) REFERENCES products(product_id), FOREIGN KEY (dealer_id) REFERENCES dealers(dealer_id), CONSTRAINT user_cart_item PRIMARY KEY (user_id, product_id, dealer_id))'
      con.query(sql, function (err, result) {
        if (err) throw err
        console.log('user_cart table created!')
      })
      sql = 'CREATE TABLE dealer_sells (dealer_id INT NOT NULL, product_id INT NOT NULL, dw_cpu INT(5), quantity_available INT(3) NOT NULL, sell_status INT(1) DEFAULT 1, FOREIGN KEY (product_id) REFERENCES products(product_id), FOREIGN KEY (dealer_id) REFERENCES dealers(dealer_id), CONSTRAINT dealer_item PRIMARY KEY (dealer_id, product_id))'
      con.query(sql, function (err, result) {
        if (err) throw err
        console.log('dealer_sells table created!')
        res.sendStatus('')
      })
    })
  })
})

export default ekartDb
// module.exports = ekartDb