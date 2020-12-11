var express = require('express');
var router = express.Router();
var User = require('../models/user');


var authenticate = require('../middleware/authenticate');


router.get('/api/user/',authenticate,(req,res)=>{
    res.send(req.user);
});




module.exports = router;