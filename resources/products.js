// Dependencies
var express = require('express');
var mysql = require('mysql');
const bodyParser = require("body-parser");
var products = express.Router();

const conPool = mysql.createPool({
	connectionLimit:10,
	host: "localhost",
	user: "root",
	password: "rohan296",
	database:"ekart"
});

// Express - body parser
products.use(bodyParser.urlencoded({ extended: true }));
products.use(bodyParser.json());

products.get('/', function (req, res) {
	var sql = "SELECT products.product_id, products.product_name, products.brand_name, category.category_name, products.product_info, products.product_status, products.avg_rating, products.price FROM products INNER JOIN category ON products.category_no=category.category_no";
	conPool.query(sql, function (err, result, fields) {
		if(err){
			res.sendStatus(500);
			res.end();
			console.log(err);
			return;
		}
		res.send(result);
	});
});


products.get('/:id', function (req, res) {
	var sql = "SELECT products.product_id, products.product_name, products.brand_name, category.category_name, products.product_info, products.product_status, products.avg_rating, products.price FROM products INNER JOIN category ON products.category_no=category.category_no WHERE product_id = ?";
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

products.get('/brand/:name', function (req, res) {
	var sql = "SELECT * FROM products WHERE brand_name = ?";
	var values = req.params.name;
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

products.post('/', function (req, res) {
	var sql = "INSERT INTO products (product_name, brand_name, category_no, product_info, avg_rating, product_status, price) VALUES ?";
	var values = [[req.body.productName, req.body.brandName, req.body.categoryNo, req.body.productInfo, req.body.avgRating, req.body.productStatus, req.body.price]];
	
	conPool.query(sql, [values], function(err, result){
		if(err){
			res.sendStatus(500);
			res.end();
			console.log(err);
			return;
		}
		console.log('Product ' + req.body.productName + ', with product id ' + result.insertId + ' successfully added!');
		res.send('Product ' + req.body.productName + ', with product id ' + result.insertId + ' successfully added!');
	});
});

module.exports = products;

