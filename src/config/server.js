const express = require('express');
const cors = require('cors');
const config = require('./config');
const Routes = require('../helpers/routerHelper');
const Database = require('./db');

/**
 * Server class responsible for setting up and running the web server.
 */
class Server {
    constructor(dataBase = new Database(), port = config.PORT, app = express()){
        this.port = port;
        this.app = app;
        this.dataBase = dataBase;
        this.dataBase.connectDB();

        //Middlewares
        this.corsMiddleware();
        this.parserMiddleware();

        // Routes
        this.routes = new Routes(this.app);
        this.setup();
    }

    /**
     * Configures CORS middleware to allow cross-origin requests.
     */
    corsMiddleware(){
        this.app.use( cors() );
    }
    
    /**
     * Configures the parser middleware to read and parse request bodies as JSON.
     */
    parserMiddleware(){
        this.app.use( express.json() );
        //Public dir
        //this.app.use( express.static('public') );
    }

    /**
     * Sets up routes using the `Routes` helper class.
     */
    setup(){
        this.routes.setupRoutes();
    }

    /**
     * Starts the server to listen on the specified port.
     */
    listen(){
        this.app.listen(this.port, () => {
            console.log('server', this.port);
        });
    }
}

module.exports = Server;
