const express = require("express");
const request = require('request-promise-native');

let app = express();

app.get('/costumer/:id',async (req, res)=>{
    let id=req.params.id;

    const customerUri = `http://localhost:5001/costumers/${id}`;
    var customer = JSON.parse(await request(customerUri));
    //console.log(customer);

    const addressUri = `http://localhost:5002/address/${id}`;
    var address = JSON.parse( await request(addressUri));
    //console.log(address);
    customer.addresses=address;

    res.json(customer);
});

app.listen(5003,()=>{
    console.log("App in ascolto sulla porta 5003");
});