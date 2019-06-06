const sql = require("mssql");
const express = require("express");
const bodyParser = require('body-parser');
let app = express();

const config = {
    user: 'suser',
    password: 'password',
    server: 'server', 
    database: 'db',
    port: 1433,
    options: {encrypt: true} // Use this if you're on Windows Azure
};


app.use(bodyParser.json());

app.get("/address", (req,res) =>{

    var conn = new sql.ConnectionPool(config);

    conn.connect()
        .then(function () {
        var sqlreq = new sql.Request(conn);
        sqlreq.query(`select * 
                    from [SalesLT].[Address]`)

        .then(function (result) {
            //console.log("tutti address ok");
            res.send(result);
            res.status(200);
            conn.close();
        })

        // Handle sql statement execution errors
        .catch(function (err) {
          console.log(err);
          conn.close();
        })

    })
    // Handle connection errors
    .catch(function (err) {
        console.log(err);
        conn.close();
    });
})

app.get("/address/:id", (req,res) =>{
    
    var id = req.params.id;
    var conn = new sql.ConnectionPool(config);
    conn.connect()

    .then(function () {

        var sqlreq = new sql.Request(conn);
        
        sqlreq
        .input("id", id)
        .query(`SELECT Address.* FROM [SalesLT].[Address],
        [SalesLT].[Customer],[SalesLT].[CustomerAddress]
        WHERE Customer.CustomerID=CustomerAddress.CustomerID AND
        Address.AddressID=CustomerAddress.AddressID AND 
        Customer.CustomerID=@id`)

        .then(function (result) {
            res.send(result.recordset);
            res.status(200);
            conn.close();
        })

        // Handle sql statement execution errors
        .catch(function (err) {
            res.send(err);
            res.status(500);
            conn.close();
        })

    })
    // Handle connection errors
    .catch(function (err) {
        res.send(err);
        res.status(500);
        conn.close();
    });
})

app.listen(5002,()=>{
    console.log("App in ascolto sulla porta 5002");
});