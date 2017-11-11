const https = require('https');
var express = require('express');
var jsonfile = require('jsonfile');
var parser = require('fast-xml-parser');

const sortimentFilePath = './json/sortiment.json';
const lastFetchedFilePath = './json/lastFetched.json';

app = express();
port = process.env.PORT || 3000;

app.listen(port);

app.get('/sortiment', function(req, mainRes, next) {
    mainRes.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');    
    mainRes.writeHead(200, {'Content-Type': 'application/json'});
    if (shouldFetch()) {
        var path = 'https://www.systembolaget.se/api/assortment/products/xml';
        var r = https.get(path, function(res) {
            var xml = '';
            // // Data comes in chunks
            res.on('data', function(chunk) {
                xml += chunk;
            }).on('end', function() {
                // Parse xml string to json
                var json = parser.parse(xml);
                // Save to filr
                jsonfile.writeFile(sortimentFilePath, json, function (err) {
                    console.error(err)
                });
                jsonfile.writeFile(lastFetchedFilePath, {date: new Date()}, function (err) {
                    console.error(err)
                });
                var jsonString = JSON.stringify(json);
                mainRes.write(jsonString);
                mainRes.end('');
            })
        });
        r.on('error', function(e) {
            mainRes.write(getSortimentFromFile());
            mainRes.end('');
        });
    } else {
        mainRes.write(getSortimentFromFile());
        mainRes.end('');
    }
});

var getSortimentFromFile = function() {
    var sortiment = jsonfile.readFileSync(sortimentFilePath);
    if (sortiment) {
        return JSON.stringify(sortiment);
    } else {
        return JSON.stringify({error: "can't read file: " + sortimentFilePath});
    }
}

var shouldFetch = function() {
    var file = './json/lastFetched.json';
    var lastFetched = jsonfile.readFileSync(file);
    if (lastFetched) {
        var date = new Date(lastFetched.date);
        var today = new Date();
        return date.toDateString() !== today.toDateString();
    }
    return false;
}