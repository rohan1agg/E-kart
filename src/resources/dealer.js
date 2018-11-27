// Dependencies
import express from 'express'
import getConnection from './dbconnection'

const dealer = express.Router()
const conPool = getConnection()

dealer.get('/', function (req, res) {
	var sql = "SELECT * FROM dealers"
	
	conPool.query(sql, function(err, result, fields){
		if(err){
			res.sendStatus(500)
			res.end()
			console.log(err)
			return
		}
		res.json(result)
	})
})

dealer.post('/login', function (req, res) {
	var sql = "SELECT dealer_id, dealer_name, mobile_no, address, email_id FROM dealers WHERE dealer_id = ? AND password = ?"
	conPool.query(sql, [req.body.dealerId, req.body.pass], function(err, result){
		if(err){
			res.sendStatus(500)
			res.end()
			console.log(err)
			return
		}
		if(result[0])res.json(result)
		else res.send("Invalid Credentials!")
	})
})

dealer.post('/register', function (req, res) {
	var sql = "INSERT INTO dealers (dealer_id, dealer_name, password, address, mobile_no, email_id) VALUES ?"
	var values = [[req.body.dealerId, req.body.dealerName, req.body.password, req.body.address, req.body.mobileNo, req.body.emailId]]
	conPool.query(sql, [values], function(err, result){
		if(err){
			res.sendStatus(500)
			res.end()
			console.log(err)
			return
		}
		console.log('Dealer ' + req.body.dealerName + ', with Dealer ID ' + req.body.dealerId + ', with Insert ID ' + result.insertId + ' successfully added!')
		res.send('Hi ' + req.body.dealerName + ', you have successfully registered with E-kart!\n Dealer ID ' + req.body.dealerId + ', and Mobile No. ' + req.body.mobileNo)
	})
})

export default dealer