import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import helmet from 'helmet';
import { Routes } from '../helpers/routerHelper.js';
import { Database } from './db.js';

/**
 * Server class responsible for setting up and running the web server.
 */
class Server {
    constructor(dataBase = new Database(), port = process.env.PORT , app = express()){
        this.port = port;
        this.app = app;
        this.dataBase = dataBase;
        this.dataBase.connectDB();

        //Middlewares
        this.app.use(helmet());

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
        // enable CORS for all routes and for our specific API-Key header
        /*this.app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, API-Key')
            next();
        });*/
    }
    
    /**
     * Configures the parser middleware to read and parse request bodies as JSON.
     */
    parserMiddleware(){
        this.app.use( express.json() );
        //Public dir
        this.app.use( express.static('public') );
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

export {
    Server
}