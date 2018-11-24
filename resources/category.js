// Dependencies
var express = require('express');
var mysql = require('mysql');
const bodyParser = require("body-parser");
var category = express.Router();

const conPool = mysql.createPool({
	connectionLimit:10,
	host: "localhost",
	user: "root",
	password: "rohan296",
	database:"ekart"
});

// Express - body parser
category.use(bodyParser.urlencoded({ extended: true }));
category.use(bodyParser.json());

category.get('/', function (req, res) {
	var sql = "SELECT * FROM category";
	conPool.query(sql, function (err, result, fields) {
		if(err){
			res.sendStatus(500);
			res.end();
			console.log(err);
			return;
		}
		res.json(result);
	});
});

category.get('/:id', function (req, res) {
	var sql = "SELECT * FROM category WHERE category_no = ?";
	var values = req.params.id;
	conPool.query(sql, [values], function (err, result, fields) {
		if(err){
			res.sendStatus(500);
			res.end();
			console.log(err);
			return;
		}
		res.send(result);
	});
});

category.post('/', function (req, res) {
	var sql = "INSERT INTO category (category_name) VALUES (?)";
	conPool.query(sql, [req.body.categoryName], function(err, result){
		if(err){
			console.log(err);
			res.sendStatus(500);
			res.end();
			return;
		}
		console.log('Category ' + req.body.categoryName + ', with insert id ' + result.insertId + ' successfully added!');
		res.send('Category ' + req.body.categoryName + ' successfully added!');
		return;
	});
});

category.delete('/', function (req, res) {
	var sql = "DELETE FROM category";
	conPool.query(sql, function (err, result, fields) {
		if(err) throw err;
		res.send("All category deleted successfully");
		return;
	});
});

module.exports = category;

