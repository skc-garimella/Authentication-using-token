//main starting point.

const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = require('./router');
const mongoose = require('mongoose');

const app = express();


//DB setup
//Connection is an object that represents one or more connections to Mongodb.
mongoose.connect('mongodb://localhost:27017/auth', (err) => {
    if(err) console.log(err.message);
    else console.log("Connected to MongoDB");
});


//APP SETUP

//morgan and body-parser are middleware in express. So, any incoming request passes through them.
// .use is used to register a middleware.
//morgan is a logging framework.
app.use(morgan('combined'));

//middleware used to parse incoming requests. Any incoming request is parsed as JSON.
app.use(bodyParser.json({ type: '*/*' }));


//Router
router(app);


//SERVER SETUP.
const port = process.env.PORT || 3090; //if there is an env variable of PORT defined, use that. Else use 3090.

//create a http server which knows how to receive requests and forward it to express app.
//we will add functionality to app over time.
const server = http.createServer(app);
server.listen(port);

console.log('server listening on', port );
