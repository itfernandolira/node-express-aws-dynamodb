const dynamodb=require("../database/database");

var params = {
    TableName : "Users",
    AttributeDefinitions: [       
        { AttributeName: "email", AttributeType: "S" }
    ],
    KeySchema: [       
        { AttributeName: "email", KeyType: "HASH"} //Partition key
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