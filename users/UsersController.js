const express=require("express");
const docClient = require("../database/docClient");
const router=express.Router();
const bcrypt=require('bcryptjs');
const adminAuth=require("../middlewares/adminAuth");

router.get("/login",(req,res)=>{
    res.render("users/login");
});

router.get("/create",adminAuth,(req,res)=>{
    res.render("users/create");
});

router.post("/users/save",adminAuth,(req,res)=>{
    var email=req.body.email;
    var password=req.body.password;

    if (email!=undefined){
        var salt=bcrypt.genSaltSync(10);
        var hash=bcrypt.hashSync(password,salt);
        if (email!=undefined){
            
            var params = {
                TableName:"Users",
                Item:{
                    "email":   email,
                    "password": hash
                }
            };
            docClient.put(params, function(err, data) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    res.redirect("/login");
                }
            });

        } else {
            res.redirect("/login");
        }
    }else {
        res.redirect("/login");
    }
});

router.post("/authenticate",(req,res)=>{
    var email=req.body.email;
    var password=req.body.password;

    if (email!=undefined&&email!="") {
        var params = {
            TableName : "Users",
            KeyConditionExpression: "#sId = :sId",
            ExpressionAttributeNames:{
                "#sId": "email"
            },
            ExpressionAttributeValues: {
                ":sId": email
            }
        };
        docClient.query(params, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                //console.log(data);
                if (data.Count>0){
                    var correct=bcrypt.compareSync(password,data.Items[0].password);
                    if (correct){
                        req.session.user ={
                            email: data.Items[0].email
                        }
                        res.redirect("/services");
                    }else {
                        res.redirect("/login");
                    } 
                }
                else {
                    res.redirect("/login");
                }
            }
        });
    }

});

router.get("/logout",adminAuth,(req,res)=>{
    req.session.user=undefined;
    res.redirect("/");
});

module.exports=router;