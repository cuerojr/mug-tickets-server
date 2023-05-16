Back: 
    + CRUD de usuarios
    + Autenticación/Uso de token
    + Manejo de sesión (esto capaz que es front)
    + CRUD evento


    ESTRUCTURA DE DATOS TENTATIVA:    
    
    Eventos: 
        + Tipo de entrada (General, Platea, etc)
        + Cantidad de entradas disponibles
        + Fecha limite de compra de entradas
        + Información sobre el show (Titulo, dirección, fecha y hora, etc)
        
    Entradas: 
        + Evento al que pertenece
        + Titular (quien hizo la compra: Nombre y apellido, DNI)
        + Asistente (quien va a asistir al show)
        + Fue validada? (Boolean. True: si la persona ya ingresó al evento)
        + Fecha y hora de compra
        + Fecha y hora de validación
    
    Usuarios:
        + Nombre y apellido
        + DNI
        + Historial de entradas compradas
        + Entradas activas (no tiene que estar necesariamente en la db)

///////////////////////////////////////////////////////////////////////////////////////////

project-root/
├── src/
│   ├── config/
│   │   ├── env.js
│   │   ├── mongoose.js
│   │   ├── authentication.js
│   │   └── logging.js
│   ├── controllers/
│   │   ├── userController.js
│   │   └── ticketController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── user.js
│   │   └── ticket.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── ticketRoutes.js
│   └── app.js
├── .env
├── package.json
└── README.md

-src/config/env.js
This file contains environment variables for the application, such as the port number and database connection string.

-src/config/mongoose.js
This file sets up the connection to the MongoDB database using the Mongoose library.

-src/config/authentication.js
This file contains middleware functions for authentication. We replaced Passport.js with a custom middleware function that uses JSON Web Tokens (JWT) to authenticate the user.

-src/config/logging.js
This file sets up logging for the application using a logging library such as Winston.

-src/controllers/userController.js
This file contains controller functions for handling user-related CRUD operations.

-src/controllers/ticketController.js
This file contains controller functions for handling ticket-related CRUD operations.

-src/middlewares/authMiddleware.js
This file contains middleware functions for authentication. We moved the passport.js code to authentication.js.

-src/middlewares/errorMiddleware.js
This file contains middleware functions for handling errors in the application.

-src/middlewares/validationMiddleware.js
This file contains middleware functions for validating user input.

-src/models/user.js
This file defines the Mongoose schema and model for the user collection in the database.

-src/models/ticket.js
This file defines the Mongoose schema and model for the ticket collection in the database.

-src/routes/userRoutes.js
This file defines the routes for handling user-related CRUD operations.

-src/routes/ticketRoutes.js
This file defines the routes for handling ticket-related CRUD operations.

-src/app.js
This file is the entry point for the application. It sets up the Express app, registers middleware functions, and defines the routes for the application.

.env
This file contains environment variables for the application, such as the port number and database connection string.

package.json
This file contains metadata about the application, such as the name and version, as well as a list of dependencies.

README.md
This file contains documentation and instructions for setting up and running the application.