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
	query1();
	afterConnection();
})

function query1(){
	console.log("Here list the product list, please enjoy!!! ")
	connection.query("SELECT * FROM products",function(err,res){
		for(var i = 0; i < res.length; i++){
			console.log(res[i]);
			console.log("=======================");
		}	
	});
	// connection.end();
}

function afterConnection(){
	connection.query("SELECT * FROM products",function(err,res){
	// console.log(res);
	inquirer.prompt({
		type:'input',
		name:'item_id',
		message:'pls provide the product item you want to buy?'
	}).then(function(answer){
		// console.log(answer)
		for(var i=0;i<res.length;i++){
			if(res[i].item_id == answer.item_id){
				var chosenItem = res[i];
				inquirer.prompt({
					type:'input',
					name:'number',
					message:'how many units you want to buy?',
				}).then(function(answer){
					if(chosenItem.stock_quantity < answer.number){
						console.log("Insufficent quantity");
					}
					var stock = chosenItem.stock_quantity - answer.number
					var sales = chosenItem.price*answer.number

					connection.query("UPDATE products SET ? WHERE ?",[{
								product_sales:sales
							},{
								item_id:chosenItem.item_id
							}],function(err,res){
								console.log("product_sales UPDATE");
							})

					connection.query("UPDATE products SET ?  WHERE?",[{
							stock_quantity:stock
						},{
							item_id: chosenItem.item_id
						}],function(err,res){
							console.log("update successfully")
							console.log('DEAR CUSTOMER, HERE IS YOUR RECEIPT'+'\n'+' Product_purchased:'+chosenItem.product_name+'\n Quantity:'+answer.number+'\n Price:'+chosenItem.price+'\n Total:'+chosenItem.price*answer.number)
							
						})

					connection.end();
					})
				}

			}
		})		
		})
  }



