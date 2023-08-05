const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const Routes = require('../helpers/routerHelper');
const Database = require('./db');
class Server {
    constructor(dataBase = new Database(), port = process.env.PORT, app = express()){
        this.dataBase = dataBase;
        this.port = port;
        this.app = app;
        this.dataBase.connectDB();

        //Middlewares
        this.middlewares();

        // Routes
        this.routes = new Routes(this.app);
        this.setup();
    }

    middlewares(){
        //CORS
        this.app.use( cors() );
        //lectura y parseo del body
        this.app.use( express.json() );
        //Public dir
        //this.app.use( express.static('public') );
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
