const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');

class Server {
    constructor(){
        this.app = express();
        connectDB();
        this.port = process.env.PORT;

        //Middlewares
        this.middlewares();

        // Routes
        this.routes();
    }

    middlewares(){
        //CORS
        this.app.use( cors() );
        //lectura y parseo del body
        this.app.use( express.json() );
        //Public dir
        this.app.use( express.static('public') );
    }

    routes(){
        this.app.use('/api/users', require('../routes/userRoutes'));
        this.app.use('/api/tickets', require('../routes/ticketRoutes'));
        this.app.use('/api/events', require('../routes/eventRoutes'));
        this.app.use('/api/login', require('../routes/logInRoutes'));        
    }

    listen(){        
        this.app.listen(this.port, ()=>{
            console.log('server', this.port)
        });
    }
}

module.exports = Server;
