var express = require('express');
var app = express();

var mongoose = require('mongoose');
var {MONGOURI} = require("./config/keys.js");
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json());
app.use(require('./routes/auth'));



var PORT = 3000;
mongoose.connect(MONGOURI,{useNewUrlParser:true,useUnifiedTopology:true},(err)=>{
    if(!err){
        console.log("MongoDB Connected...");
    }else{
        console.log(err);
    }
});


app.listen(PORT,()=>{
    console.log("Server running on port",PORT);
});