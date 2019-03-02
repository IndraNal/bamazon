var inquirer = require("inquirer");
var mysql = require("mysql");

var total = 0;
var remQty;

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",

    // Your password
    password: "Sahana123$",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
});

var query = connection.query("SELECT * FROM bamazon.products",
    function (err, res) {
        if (err) throw err;
        console.log("item_id" + "|" + "product_name" + " | " + "department_name" + " | " + "price" + " | " + "stock_quantity");
        if (res.length > 0) {
            for (var i = 0; i < res.length; i++) {

                console.log(" |" + res[i].item_id + " |" + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + " | ");
            }

        } else {
            console.log("Oops, no products to show");
        }

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'ID',
                    message: 'Input the ID of the Product'
                },
                {
                    type: 'input',
                    name: 'units',
                    message: 'Input how many units of Product needed'
                }
            ])
            .then(answers => {
                ID = answers.ID;
                Units = answers.units;

                if (ID !== "") {
                    getproductByID();
                } else {
                    console.log("Please enter the ID");
                }
            });
    });



function getproductByID() {
    var query = connection.query("SELECT * FROM bamazon.products WHERE item_id = ?;",
        [ID],
        function (err, res) {
            if (err) throw err;

            if (res.length > 0) {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].stock_quantity >= Units) {
                        console.log(" We have enough quantity :" + res[i].stock_quantity);
                        var total = (res[i].price) * Units;
                        console.log(total);
                        remQty = res[i].stock_quantity - Units;
                        console.log("Remaining quantity :" + remQty);
                        var query = connection.query("UPDATE bamazon.products SET stock_quantity=? WHERE item_id = ?",
                            [remQty, ID],
                            function (err, res) {
                                console.log(res);
                                if (err) throw err;
                                console.log("your total price is :" + total);
                            });
                    }
                    else {
                        console.log("Insufficient qty")
                    }
                }
            }
            else {
                console.log("Oops, no products to show");
            }
            connection.end();
        });
}


