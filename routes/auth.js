var express = require('express');
var router = express.Router();
var User = require('../models/user');
const bcrypt = require('bcryptjs');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const { HolidayAPI } = require('holidayapi');
var authenticate = require('../middleware/authenticate');



router.get('/',(req,res)=>{
    res.send("API Implementation");
    
});




router.post('/api/signup',(req,res)=>{ 
    const {name,email,password,referrer} = req.body;
    const  referral_code = shortid.generate();
    var counter1 =1;
    var counter2 =1;
    var reward;
    
    User.find({},(err,users)=>{
        if(err) throw err;
        if(users.length>=1){

            User.findOne({referral_code:referrer}).then((refUser)=>{
                var id = refUser._id;
                var count1 = refUser.counter1;
                var count2 = refUser.counter2;
                var day = new Date();
                
                
                if(day==6 || day==0){   // 6 means staturday and 0 means sunday 
                    if(count1<=3){
                        reward = 40;
                        var res1 = ++count1;
                        console.log(res1);
                        User.findByIdAndUpdate(id, { counter1:res1,$push: {"track": name}}, 
                            function (err, docs) { 
                            if (err){ 
                                console.log(err) 
                            }else{
                                console.log("Updated Count1");
                            }
                            
                        });
                    }else{
                        reward=20;
                        User.findByIdAndUpdate(id, {$push: {"track": name}}, 
                            function (err, docs) { 
                            if (err){ 
                                console.log(err) 
                            }else{
                                console.log("Updated1");
                            }
                            
                        });
                    }
                   
                }else {
                    if(count2<=2){
                        reward=20;
                        var res2 = ++count2;
                        console.log(res2);
                        User.findByIdAndUpdate(id, { counter2: res2,$push: {"track": name}}, 
                            function (err, docs) { 
                            if (err){ 
                                console.log(err) 
                            }else{
                                console.log("Updated2");
                            }
                        });
                    }else{
                        reward=10;
                        User.findByIdAndUpdate(id, {$push: {"track": name}}, 
                            function (err, docs) { 
                            if (err){ 
                                console.log(err) 
                            }else{
                                console.log("Updated");
                            }
                        });
                        
                    }
                }
            }).catch(err=>{
                console.log(err);
            })

        }else{
            // at time of first sign up  by admin
            reward=100
        }
    });
    
    
    
    if(!name || !email || !password  ||!referral_code){
        return res.status(422).json({error:"Please fill all fields!"});
    }else{
        User.findOne({email:email}).then((savedUser)=>{
            if(savedUser){
               return res.json({error:"Email is alreday exists!"});
            }
            bcrypt.hash(password,12)
            .then(hashedpassword=>{
                const user = new User({
                    name,
                    email,
                    password:hashedpassword,
                    referral_code:referral_code,
                    referrer:referrer,
                    counter1:counter1,
                    counter2:counter2,
                    reward:reward
                    
                })
                user.save().then(user=>{
                    res.json({message:"You are signed up Successfully!"});
                })
                .catch(err=>{
                    console.log(err);
                });   

            });
            
        })
        .catch(err=>{
            console.log(err)
        });
    }

});

router.post('/api/signin',(req,res)=>{
    const {email,password} = req.body;
    if(!email || ! password){
        return res.status(422).json({error:"Invalid email or password!"});
    }

    User.findOne({email:email}).then((savedUser=>{
        if(!savedUser){
            return res.json({error:"Email is not registereed!"});
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                var token = jwt.sign({_id:savedUser._id,},JWT_SECRET);
                const {_id,name,email} = savedUser;
                res.json({message:"You are signed in successfully!",token:token,user:{_id,name,email}});
            }else{
                return res.status(422).json({error:"Invalid password!"});
            }
        })
        .catch(err=>{
            console.log(err);
        })


    }))
    .catch(err=>{
        console.logo(err);
    })

});


// parent can see all their children referrer

router.get('/api/parent',authenticate,(req,res)=>{
   res.send(req.user.track);
});


// children can see their parent 
router.get('/api/children',authenticate,(req,res)=>{
    User.findOne({referrer:req.user.referrer},(err,user)=>{
        if(err) throw err;
        res.send(user.name);
    });
    
})


module.exports = router;