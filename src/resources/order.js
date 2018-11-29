// Dependencies
import express from 'express'
import getConPool from './dbconnection'

const order = express.Router()
const conPool = getConPool()

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
    let userOrders = (result) => {
      return Promise.all(result.map(x => {return orderContents(x)}))
    }
    function orderContents(x) {
      var sql = 'SELECT product_id, dealer_id, quantity FROM order_contents WHERE order_id = ?'
      return new Promise((resolve, reject) => {
        conPool.query(sql, [x.order_id], (err, items, fields) => {
          if (err) {
            res.sendStatus(500)
            res.end()
            reject(err)
          }
          x.items = items
          resolve(x)
        })
      })
    }
    userOrders(result).then(values => {
      res.json(values)
    }).catch(err =>{
      res.sendStatus(500)
      console.log(err)
    })
  })
})

order.get('/id', (req, res) => {
  var sql = 'SELECT * FROM user_orders WHERE order_id = ?'
  conPool.query(sql, [req.query.orderId], (err, result, fields) => {
    if (err) {
      res.sendStatus(500)
      res.end()
      console.log(err)
      return
    }
    var sql = 'SELECT product_id, dealer_id, quantity FROM order_contents WHERE order_id = ?'
    conPool.query(sql, [req.query.orderId], (err, items, fields) => {
      if (err) {
        res.sendStatus(500)
        res.end()
        console.log(err)
        return
      }
      result[0].items = items
      res.json(result)
    })
  })
  
})

order.post('/', (req, res) => {
  conPool.getConnection((err, con)=>{
    con.beginTransaction(err => {
      if(err){
        res.sendStatus(500)
        res.end()
        console.log(err)
        return
      }
      var orderAmount, orderID
      var sql = 'SELECT SUM(price) AS amount FROM products WHERE product_id IN (?)'
      var values = req.body.items.map(x => x.productId)
      var promQ = new Promise((resolve, reject) => {
        con.query(sql, [values], (err, result, fields)=>{
          if (err) {
            reject(err)
            console.log(err)
            return
          }
          orderAmount = result[0].amount
          resolve(orderAmount)
        })
      })
      promQ.then(()=>{
        sql = 'INSERT INTO user_orders (user_id, order_amount, order_status) VALUES ?'
        values = [[req.body.userId, orderAmount, req.body.orderStatus]]
        var promQ2 = new Promise((resolve, reject) => {
          con.query(sql, [values], (err, result, fields) => {
            if (err) {
              reject(err)
              console.log(err)
              return
            }
            orderID = result.insertId
            resolve(result.insertId)
          })
        })
        promQ2.then((ID)=>{
          var items = req.body.items.map(x => [ID, x.productId, x.dealerId, x.quantity])
          sql = 'INSERT INTO order_contents (order_id, product_id, dealer_id, quantity) VALUES ?'
          con.query(sql, [items], (err, result, fields)=>{
            if(err){
              res.sendStatus(500)
              res.end()
              con.rollback(()=>{console.log(err)})
              return
            }
            con.commit(err=>{
              if(err){
                res.sendStatus(500)
                res.end()
                con.rollback(()=>{console.log(err)})
                return
              }
              console.log('Success')
              console.log('Order Contents inserted rows' + result.affectedRows)
              res.send('Your order Placed has been successfully placed!\n Order ID: ' + orderID + ', \nTotal Order Amount = ' + orderAmount)
            })
          })
        })
      })
    })
  })
})

export default order