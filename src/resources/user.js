// Dependencies
import express from 'express'
import getConnection from './dbconnection'

const user = express.Router()

const conPool = getConnection()

user.get('/', function (req, res) {
	var sql = "SELECT * FROM users"
	
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

user.post('/login', function (req, res) {
	var sql = "SELECT users.user_id, users.user_name, users.mobile_no, users.address, users.email_id FROM users WHERE user_id = ? AND password = ?"
	conPool.query(sql, [req.body.userId, req.body.pass], function(err, result, fields){
		if(err){
			res.sendStatus(500)
			res.end()
			console.log(err)
			return
		}
		if(result[0])res.json(result)
		else res.send("Invalid User Credentials!")
	})
})

user.post('/', function (req, res) {
	var sql = "INSERT INTO users (user_id, user_name, password, mobile_no, address, email_id) VALUES ?"
	var values = [[req.body.userId, req.body.userName, req.body.password, req.body.mobileNo, req.body.address, req.body.emailId]]
	console.log(values)
	conPool.query(sql, [values], function(err, result){
		if(err){
			res.sendStatus(500)
			res.end()
			console.log(err)
			return
		}
		console.log('User ' + req.body.userName + ', with User ID ' + req.body.userId + ', with Insert ID ' + result.insertId + ' successfully added!')
		res.send('Hi ' + req.body.userName + ', you have successfully registered with E-kart!\n User ID ' + req.body.userId + ', and Mobile No. ' + req.body.mobileNo)
	})
})

export default user