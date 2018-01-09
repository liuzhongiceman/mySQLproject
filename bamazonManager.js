'use strict';
var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host:'localhost',
	port:8889,
	user:'root',
	password:'root',
	database:'bamazon'
})

connection.connect(function(err){
	if(err) throw err;
	console.log('connected as id'+connection.threadId);
	start();
})

function start(){
	inquirer.prompt(
		{
			type:'rawlist',
			name:'manager',
			message:'What do you want to do?',
			choices: [
				"View Products for Sale",
				"View Low Inventory",
				"Add to Inventory",
				"Add New Product",
			]
	}).then(function(answer){
		console.log(answer);
		console.log(answer.manager);
				if(answer.manager == "View Products for Sale"){
			viewProduct();
		}

		else if(answer.manager == "View Low Inventory"){
			viewLow();
		}
		else if(answer.manager == "Add to Inventory"){
			addInvent();
		}
		else if(answer.manager == "Add New Product"){
			addNew();
		}
	})
}

function viewProduct(){
	connection.query("SELECT * FROM products",function(err,res){
		for(var i = 0; i < res.length; i++){
			console.log(res[i]);
			console.log("=======================");
		}	
	});
	connection.end();
	
}

function viewLow(){
	connection.query("SELECT product_name FROM products WHERE stock_quantity < 5", function(err,res){
			if(res.length<1){
				console.log("Our Inventory looks good, no product's Inventory is below 5")
			}
			else {console.log(res);
			}
		})
	connection.end();
}

function addNew(){
	inquirer.prompt([{
		type:'input',
		name:'item_id',
		message:'pls input your item_id'
	},{
		type:'input',
		name:'product_name',
		message:'pls input your product_name'
	},{
		type:'input',
		name:'department_name',
		message:'pls input your department_name'
	},{
		type:'input',
		name:'price',
		message:'pls input your price'
	},{
		type:'input',
		name:'stock_quantity',
		message:'pls input your stock_quantity'
	}]).then(function(answer){
		var sql = "INSERT INTO products SET ?" 
		var value = {item_id:Number(answer.item_id),product_name:answer.product_name,department_name:answer.department_name,price:Number(answer.price),stock_quantity:Number(answer.stock_quantity)}
		console.log(value);
		connection.query(sql, value,function(err,result){
			if(err) throw err;
			console.log("Number of records inserted:"+result.affectedRows);
		})
		connection.end();
	})
}

function addInvent(){
		inquirer.prompt({
		type:"input",
		name:"item_id",
		message:'Pls input the item id you want to add Inventory'
	}).then(function(res){
		var sql = "SELECT * FROM products WHERE item_id = ?"
		// console.log(res.item_id);
		connection.query(sql,[res.item_id],function(err,result){
			var user = JSON.parse(JSON.stringify(result))
		
			// console.log(user,user[0].stock_quantity);

			inquirer.prompt({
				type:"input",
				name:"stock_quantity",
				message:"Pls input the quantity you want to add"
			}).then(function(answer){
				var stock = user[0].stock_quantity + Number(answer.stock_quantity)
				// console.log(stock);
				var sql = "UPDATE products SET ? WHERE ?"
				connection.query(sql,[{stock_quantity:stock},{item_id:res.item_id}] ,function(err,result){
				if(err) throw err;
				console.log("You successfully added one Inventory:"+result.affectedRows);
				})
			connection.end();

			})
			
		})
		
	});
};

