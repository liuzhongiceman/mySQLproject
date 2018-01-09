'use strict';
var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');
var Table = require('cli-table');

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
	inquirer.prompt({
		type:'rawlist',
		name:'choices',
		message:'what do you want to do?',
		choices:['View Product Sales by Department','Create New Department']
	}).then(function(answer){
		console.log(answer.choices)
		if(answer.choices == 'View Product Sales by Department'){
		connection.query("SELECT department_id, departments.department_name,over_head_costs,product_sales,(product_sales-over_head_costs) AS total_profit FROM departments INNER JOIN products ON departments.department_name = products.department_name GROUP BY department_id",function(err,res){
				var user = JSON.parse(JSON.stringify(res))
				// console.log(user,user[0],user[0].total_profit)
				console.table(user);
			
				
			})
		}
	})
}

