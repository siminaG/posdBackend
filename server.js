const express = require('express');
const cors = require('cors');
const azure = require('azure-storage');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const storageAccountAccessString  = '';
const tableService = azure.createTableService(storageAccountAccessString);

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})