const dynamodb=require("../database/database");

var params = {
    TableName : "Services",
    AttributeDefinitions: [       
        { AttributeName: "serviceId", AttributeType: "S" },
        { AttributeName: "entityId", AttributeType: "S" }
    ],
    KeySchema: [       
        { AttributeName: "serviceId", KeyType: "HASH"}, //Partition key
        { AttributeName: "entityId", KeyType: "RANGE"}
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});