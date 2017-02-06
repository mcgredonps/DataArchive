var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');

var PORT = 8001;

// Serve up the html form if it's a get, if it's
// a post save the form to JSON file
var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get') {
        displayForm(res);
    } else if (req.method.toLowerCase() == 'post') {
        processAllFieldsOfTheForm(req, res);
    }

});

/**
 * Read the html form disk, send to client
 */
function displayForm(res) {
    fs.readFile('form.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}

/**
 * Post operation. Extract the fields from the form, write
 * to json format on disk
 */
function processAllFieldsOfTheForm(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');
        res.end(util.inspect({
            fields: fields,
            files: files
        }));

    var fileName = "data/" + fields.exercise + "/" + fields.exercise + "_" + "M" + fields.mission + "_Sortie" + fields.sortie + "_UAV" + fields.uavid + ".json";
    
    var fileExists = true;
    var failCounter = 1;
   
    do
    {
        if (fs.existsSync(fileName)) 
        {
            fileName = "data/" + fields.exercise + "/" + fields.exercise + "_" + "M" + fields.mission + "_Sortie" + fields.sortie + "_UAV" + fields.uavid + "_Rev" + failCounter + ".json";
            failCounter++;
        }
        else
        {
            fileExists = false;
        }
   }
   while(fileExists === true);
   
   
    fs.writeFile(fileName, util.inspect({
            fields: fields}), function(err) {
      if(err) { return console.log(err); }});

    });
}



server.listen(PORT);
console.log("server listening on ", PORT);

