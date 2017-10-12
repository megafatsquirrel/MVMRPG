'use strict';

const express = require( 'express' );

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

app.use( '/', express.static( __dirname ) );
app.get( '/', function ( req, res ) {
    res.sendFile( __dirname + '/index.html' );
} );

const port = Number( process.env.PORT || PORT );
const server = app.listen( port, function () {
    console.log( 'Started Server: Port %d', server.address().port );
    console.log(`Running on http://${HOST}:${PORT}`);
} );
