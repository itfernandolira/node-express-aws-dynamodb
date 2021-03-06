const express=require("express");
const docClient = require("../database/docClient");
const router=express.Router();

router.get("/api/services",(req,res)=>{
    var params = {
        TableName: "Services",
        ProjectionExpression: "serviceId, service, description, entityId, durationMinutes, filePic"
    };
    docClient.scan(params, onScan);
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            //console.log(data);
            res.status(200);
            res.json (data.Items);
        }
    }
});

module.exports=router;