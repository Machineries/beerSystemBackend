var express = require('express'),
app = express(),
port = process.env.PORT || 3000;

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);

app.get('/sortiment', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');    
    var data = require('./sortiment.json');
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(
        data
    ));
    res.end(''); // End the JSON array and response.);
});

app.get('/image', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');   
    var Curl = require( 'node-libcurl' ).Curl;
    var curl = new Curl();
    curl.setOpt('URL', 'craftbeer.se/sites/craftbeer.live6.client.udev.se/files/styles/product_image/public/pictures/154715.png?itok=CtU-OaKZ' );
    curl.setOpt('FOLLOWLOCATION', true);
    curl.on('end', function( statusCode, body, headers ) {
        console.info("got it");
        
        console.info( statusCode );
        console.info( '---' );
        console.info( body.length );
        console.info( body );
        res.write(body);
        console.info( this.getInfo( 'TOTAL_TIME' ) );
     
    res.write('hello world');
    res.end('');
        this.close();
    });
    curl.on( 'error', curl.close.bind( curl ) );
    curl.perform();
});