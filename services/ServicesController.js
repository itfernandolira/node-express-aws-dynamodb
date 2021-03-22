const express=require("express");
const docClient = require("../database/docClient");
const router=express.Router();
const { v4: uuidv4 } = require('uuid');
const adminAuth=require("../middlewares/adminAuth");
var multer  = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname));
    }
  });

var upload = multer({ storage: storage })

router.get("/services",adminAuth,(req,res)=>{
    var params = {
        TableName: "Services",
        ProjectionExpression: "serviceId, service, description, entityId, durationMinutes"
    };
    docClient.scan(params, onScan);
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            //console.log(data);
            res.render("services/index",{data: data});
        }
    }
});

router.get("/services/add",adminAuth,(req,res)=>{
    res.render("services/add");
});

router.post("/services/save",upload.single('filePic'),adminAuth,(req,res,next)=>{
    var service=req.body.service;
    var description=req.body.description;
    var duration=req.body.duration;
    var filePic=req.file.filename;

    if (service!=undefined){
        var params = {
            TableName:"Services",
            Item:{
                "serviceId":   uuidv4(),
                "entityId": "test",
                "service": service,
                "description": description,
                "durationMinutes": duration,
                "filePic": filePic
            }
        };
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                res.redirect("/services");
            }
        });
    } else {
        res.redirect("/services/add");
    }
});

router.post("/services/delete",adminAuth,(req,res)=>{
    var serviceId=req.body.serviceId;
    if (serviceId!=undefined){
        var params = {
            TableName:"Services",
            Key:{
                "serviceId": serviceId,
                "entityId": "test"
            },
            ConditionExpression:"serviceId = :val",
            ExpressionAttributeValues: {
                ":val": serviceId
            }
        };
        docClient.delete(params, function(err, data) {
            if (err) {
                console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                res.redirect("/services");
            }
        });
    } else {
        res.redirect("/services");
    }
});

router.get("/services/edit/:serviceId",adminAuth,(req,res) => {
    var serviceId=req.params.serviceId;
    if (serviceId!=undefined){
        var params = {
            TableName : "Services",
            KeyConditionExpression: "#sId = :sId",
            ExpressionAttributeNames:{
                "#sId": "serviceId"
            },
            ExpressionAttributeValues: {
                ":sId": serviceId
            }
        };
        docClient.query(params, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                //console.log(data);
                res.render("services/edit",{data: data});
            }
        });
    } else {
        res.redirect("/services");
    }
});

router.post("/services/update",upload.single('filePic'),adminAuth,(req,res,next)=> {
    var service=req.body.service;
    var description=req.body.description;
    var durationMinutes=req.body.durationMinutes;
    var serviceId=req.body.serviceId;
    var filePic=req.file.filename;

    var params = {
        TableName:"Services",
        Key:{
            "serviceId": serviceId,
            "entityId": "test"
        },
        UpdateExpression: "set service = :service, description=:description, durationMinutes=:durationMinutes, filePic=:filePic",
        ConditionExpression: "serviceId = :serviceId",
        ExpressionAttributeValues:{
            ":service":service,
            ":description":description,
            ":durationMinutes":durationMinutes,
            ":serviceId":serviceId,
            ":filePic":filePic
        },
        ReturnValues:"UPDATED_NEW"
    };

    docClient.update(params, function(err, data) {
        if (err) {
            console.log(params);
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            res.redirect("/services");
        }
    });

    
});

module.exports=router;