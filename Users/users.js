const express = require('express');
const sql = require("mssql");
const bodyParser = require('body-parser');

let router = express.Router();

router.use(bodyParser.json());

const config = {
    user: 'suser',
    password: 'password',
    server: 'iserver', 
    database: 'testNode',
    port: 1433,
    options: {
        encrypt: true 
    }
};



//Lista
router.get("/",(req,res)=>{

    var conn = new sql.ConnectionPool(config);

    conn.connect()

        .then(function(){

            req = new sql.Request(conn);

            req.query(`SELECT Id as id, Username as username, FullName as fullName, BirthDate as birthDate 
                       FROM [Users]`)

                .then(function (result) {
                    res.send(result);
                    res.sendStatus(200);
                    conn.close();
                })

                .catch(function (err) {
                    res.send(err);
                    res.sendStatus(500);
                    conn.close();
                })
        })

        .catch(function (err) {
            res.send(err);
            res.sendStatus(500);
            conn.close();
        })

});




//Dettaglio
router.get("/:id",(req,res)=>{

    let id=req.params.id;   
    var conn = new sql.ConnectionPool(config);

    conn.connect()

        .then(function(){

            req = new sql.Request(conn);

            req
                .input("id",id)

                .query(`SELECT Id as id, Username as username, FullName as fullName, BirthDate as birthDate
                        FROM [Users]
                        WHERE Id = @id`)

                .then(function (result) {
                    res.send(result);
                    res.sendStatus(200);
                    conn.close();
                })

                .catch(function (err) {
                    res.send(err);
                    res.sendStatus(500);
                    conn.close();
                })

        })

        .catch(function (err) {
            res.send(err);
            res.sendStatus(500);
            conn.close();
        })

});



//Inserimeno
router.post("/",(req,res)=> {

    let obj=req.body;
    var conn = new sql.ConnectionPool(config);

    conn.connect()

        .then(function () {

            req = new sql.Request(conn);

            req
                .input("username",obj.username)
                .input("fullName",obj.fullName)
                .input("birthDate",obj.birthDate)

                .query(`INSERT INTO [Users] 
                        (Username,FullName,BirthDate,CorsoITS,StudentName)
                        VALUES(@username,@fullName,@birthDate,'TSIOT','AlessandroMinca')`)

                .then(function () {
                    res.send("POST USER OK");
                    res.sendStatus(200);
                    conn.close();
                })
    
                .catch(function (err) {
                    res.send(err);
                    res.sendStatus(500);
                    conn.close();
                })

        })
    
        .catch(function (err) {
            res.send(err);
            res.sendStatus(500);
            conn.close();
        });
});



//Modifica
router.put("/:id",(req,res)=> {

    let id=req.params.id;
    let obj=req.body;
    var conn = new sql.ConnectionPool(config);

    conn.connect()

        .then(function () {

            req = new sql.Request(conn);

            req
                .input("id",id)     
                .input("username",obj.username)
                .input("fullName",obj.fullName)
                .input("birthDate",obj.birthDate)

                .query(`UPDATE [Users] 
                        SET Username = @username
                        ,FullName = @fullName
                        ,BirthDate = @birthDate              
                        WHERE Id = @id`)

                .then(function () {
                    res.send("PUT USER OK");
                    res.sendStatus(200);
                    conn.close();
                })
               
                .catch(function (err) {
                    res.send(err);
                    res.sendStatus(500);
                    conn.close();
                })

        })

        .catch(function (err) {
            res.send(err);
            res.sendStatus(500);
            conn.close();
        });

});



//Cancellazione
router.delete("/:id",(req,res)=> {

    let id=req.params.id;
    var conn = new sql.ConnectionPool(config);

    conn.connect()

        .then(function () {

            req = new sql.Request(conn);

            req
                .input("id",id)

                .query(`DELETE FROM [Users]
                        WHERE Id = @id`)

                .then(function () {
                    res.send("DELETE USER OK");
                    res.sendStatus(200);
                    conn.close();
                })
                
                .catch(function (err) {
                    res.send(err);
                    res.sendStatus(500);
                    conn.close();
                })

        })
       
        .catch(function (err) {
            res.send(err);
            res.status(500);
            conn.close();
        });
});

module.exports=router;