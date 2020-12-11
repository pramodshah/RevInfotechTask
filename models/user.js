var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    referral_code:{
        type:String,
        required:true
    },
    referrer:{
        type:String,
        required:false
    },
    counter1:{
        type:String,
        required:true
    },
    counter2:{
        type:String,
        required:true
    },
    reward:{
        type:String,
        required:false
    },
    track : { 
        type : Array , 
        "default" : [] }

    // track: [
    //     {
    //       name: {type: String, required: false}
    // }]

});
var User = mongoose.model("User",UserSchema);
module.exports = User;