import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUI from "swagger-ui-express";
import * as path from 'path';

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Ticketera API",
            version: "1.0.0"
        },
        servers: [{
            url: "http://localhost:27017"
        }]
    },
    apis: ["src/routes/*.js"],
    paths: ['']
}

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app, port) => {
    app.use('/api/docs', SwaggerUI.serve, SwaggerUI.setup(swaggerSpec));
    app.get('/api/docs', (req,res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec)
    })
    console.log(`available http://localhost:${port}/docs`)
}

export {
    swaggerDocs
}