const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const RouteLibrary = require('../helpers/routerHelper');

class Server {
    constructor(){
        this.app = express();
        connectDB();
        this.port = process.env.PORT;

        //Middlewares
        this.middlewares();

        // Routes
        this.routes = new RouteLibrary(this.app);
        this.setup();
    }

    middlewares(){
        //CORS
        this.app.use( cors() );
        //lectura y parseo del body
        this.app.use( express.json() );
        //Public dir
        this.app.use( express.static('public') );
    }

    setup(){
        this.routes.setupRoutes();        
    }

    listen(){        
        this.app.listen(this.port, () => {
            console.log('server', this.port)
        });
    }
}

module.exports = Server;
