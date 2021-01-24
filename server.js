const express = require('express');
const cors = require('cors');
const azure = require('azure-storage');
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


const storageAccountAccessString  = '';
const tableService = azure.createTableService(storageAccountAccessString);
const entGen = azure.TableUtilities.entityGenerator;

app.post('/create/table', (req, res) => {
    let tableName = req.query.name;
    if(tableName){
        tableService.createTableIfNotExists(tableName, function(error, result, response) {
            if (!error) {
                console.log(result);
                res.send(result);
                // result contains true if created; false if already exists
            }
        });
    }
});

app.delete('/delete/table', (req, res) => {
    let tableName = req.query.name;
    console.log("Table Name: ", tableName);
    if(tableName){
        tableService.deleteTable(tableName, function(error, result){
            if (!error) {
                console.log("Result: ", result);
                res.send(result);
            }
        });
    }
});

app.get('/get/tables', (req, res) => {
    tableService.listTablesSegmented(null, function (error, result){
        if(!error){
            var entries = result.entries;
            for (var i=0; i<entries.length; i++) {
                console.log(entries[i]); //prints table name
            }
            res.send(JSON.stringify(entries));
        }
    })
});

app.post('/new/entity', (req, res) => {
    let entity = {};
    let tableName = req.query.name;
    let newEntity = req.body.entity;
    Object.keys(newEntity).forEach(function(key){
        entity[key] = entGen.String(newEntity[key].toString());
    })
    console.log(entity);
    if(tableName && entity){
        tableService.insertEntity(tableName, entity, function (error, result, response){
            if(!error){
                res.send(result);
            }
        })
    }
});

app.put('/update/entity', (req, res) => {
    let entity = {};
    let tableName = req.query.name;
    let updatedEntity = req.body.entity;
    Object.keys(updatedEntity).forEach(function(key){
        entity[key] = entGen.String(updatedEntity[key].toString());
    })
    console.log(entity);
    if(tableName && entity){
        tableService.insertOrMergeEntity(tableName, entity, function (error, result, response){
            if(!error){
                res.send(result);
            }
        })
    }
});

app.get('/get/entity', (req, res) => {
    let entity = req.body.entity;
    let tableName = req.query.name;
    if(entity.PartitionKey && entity.RowKey){
        tableService.retrieveEntity(tableName, entity.PartitionKey.toString(), entity.RowKey.toString(),
            function(error, result, response){
            if(!error){
                console.log(result);
                res.send(result);
            } else{
                res.send(result);
            };
        });
    }
})

app.delete('/delete/entity', (req, res) => {
    let entity = {};
    let tableName = req.query.name;
    let deletedEntity = req.body.entity;
    Object.keys(deletedEntity).forEach(function(key){
        entity[key] = entGen.String(deletedEntity[key].toString());
    })
    if(entity && tableName){
        tableService.deleteEntity(tableName, entity, function(error, result, response){
            if(!error){
                console.log(result);
                res.send(result);
            }
        });
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})