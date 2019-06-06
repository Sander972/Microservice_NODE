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

            req.query(`SELECT Id as id, Location as location, MaxUsers as maxUsers, StartDate as startDate, EndDate as endDate
                       FROM [Events]`)

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

                .query(`SELECT Id as id, Location as location, MaxUsers as maxUsers, StartDate as startDate, EndDate as endDate
                        FROM [Events]
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



//Inserimento
router.post("/",(req,res)=> {

    let obj=req.body;
    var conn = new sql.ConnectionPool(config);

    conn.connect()

        .then(function () {

            req = new sql.Request(conn);

            req
                .input("location",obj.location)
                .input("maxUsers",obj.maxUsers)
                .input("startDate",obj.startDate)
                .input("endDate",obj.endDate)

                .query(`INSERT INTO [Events] 
                        (Location,MaxUsers,StartDate,EndDate,CorsoITS,StudentName)
                        VALUES(@location,@maxUsers,@startDate,@endDate,'TSIOT','AlessandroMinca')`)

                .then(function () {
                    res.send("POST EVENTS OK");
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
                .input("location",obj.location)
                .input("maxUsers",obj.maxUsers)
                .input("startDate",obj.startDate)
                .input("endDate",obj.endDate)

                .query(`UPDATE [Events] 
                        SET Location = @location
                        ,MaxUsers = @maxUsers
                        ,StartDate = @startDate
                        ,EndDate = @endDate                
                        WHERE Id = @id`)

                .then(function () {
                    res.send("PUT EVENT OK");
                    res.sendStatus(200);
                    conn.close();
                })

                .catch(function (err) {
                    res.send(err);
                    res.sendStatus(500);
                    conn.close();
                })

        })

        .catch(function (e) {
            res.send(e);
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
                    res.send("DELETE EVENT OK");
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