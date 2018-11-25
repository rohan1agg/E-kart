// Dependencies
// var express = require('express');
import express from 'express'
import getConnection from './dbconnection'
// var mysql = require('mysql');
// const bodyParser = require("body-parser");
const order = express.Router()

const conPool = getConnection()

// Express - body parser
// order.use(bodyParser.urlencoded({ extended: true }));
// order.use(bodyParser.json());

order.get('/all', (req, res) => {
  var sql = 'SELECT * FROM user_orders'
  conPool.query(sql, (err, result, fields) => {
    if (err) {
      res.sendStatus(500)
      res.end()
      console.log(err)
      return
    }
    res.json(result)
  })
})

order.get('/', (req, res) => {
  var sql = 'SELECT * FROM user_orders WHERE user_id = ?'
  conPool.query(sql, [req.query.userId], (err, result, fields) => {
    if (err) {
      res.sendStatus(500)
      res.end()
      console.log(err)
      return
    }
    res.json(result)
  })
})

order.post('/', (req, res) => {
  var sql = 'INSERT INTO user_orders (user_id, order_amount, order_status) VALUES ?'
  var values = [[req.body.userId, req.body.orderAmount, req.body.orderStatus]]
  conPool.query(sql, [values], (err, result, fields) => {
    if (err) {
      res.sendStatus(500)
      res.end()
      console.log(err)
      return
    }
    res.send('Your order Placed has been successfully placed!\n Order ID: ' + result.insertId)
  })
})

export default order
