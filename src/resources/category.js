// Dependencies
import express from 'express'
const category = express.Router()

// instead of creating new DB connection for every route file try using singleton pattern like we did in java project
// this mysql.createPool creates a connection pool of max: 'connectionLimit' number of DB connections, hence instead of creating new pools every time we should reuse it every time
// therefore should export this line to another file, import it everywhere and use the same connection pool again and again
// check dbconnection.js
/*const conPool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'rohan296',
  database: 'ekart'
}) */
import getConnection from './dbconnection'
const conPool = getConnection()

category.get('/', function (req, res) {
  var sql = 'SELECT * FROM category'
  conPool.query(sql, function (err, result, fields) {
    if (err) {
      res.sendStatus(500)
      res.end()
      console.log(err)
      return
    }
    res.json(result)
  })
})

category.get('/:id', function (req, res) {
  var sql = 'SELECT * FROM category WHERE category_no = ?'
  var values = req.params.id
  // DB queries must always be inside try catch
  conPool.query(sql, [values], function (err, result, fields) {
    if (err) {
      res.sendStatus(500)
      res.end()
      console.log(err)
      return
    }
    res.send(result)
  })
})

category.post('/', function (req, res) {
  var sql = 'INSERT INTO category (category_name) VALUES (?)'
  conPool.query(sql, [req.body.categoryName], function (err, result) {
    if (err) {
      console.log(err)
      res.sendStatus(500)
      res.end()
      return
    }
    console.log('Category ' + req.body.categoryName + ', with insert id ' + result.insertId + ' successfully added!')
    res.send('Category ' + req.body.categoryName + ' successfully added!')
    return
  })
})

category.delete('/', function (req, res) {
  var sql = 'DELETE FROM category'
  conPool.query(sql, function (err, result, fields) {
    if (err) throw err
    res.send('All category deleted successfully')
    return
  })
})

export default category

