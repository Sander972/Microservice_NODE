const express = require('express');
const usersRoute = require("./Users/users");
const eventsRoute = require("./Events/events");
let app = express();


app.use("/api/users", usersRoute);
app.use("/api/events", eventsRoute);

app.listen(8000,()=>{
    console.log("App in ascolto sulla porta 8000");
});