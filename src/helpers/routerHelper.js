/**
 * Class representing the setup of routes for the Express application.
 */
class Routes {
  /**
   * Create a Routes instance.
   * @param {Object} app - The Express application instance.
   */
  constructor(app) {
    this.app = app;
  }

  /**
   * Sets up the routes for the Express application by registering various route handlers.
   * Each route handler is associated with a specific route path.
   */
  setupRoutes() {
    // User Routes
    this.app.use('/api/users', require('../routes/userRoutes'));

    // Admin Routes
    this.app.use('/api/admins', require('../routes/adminRoutes'));

    // Ticket Routes
    this.app.use('/api/tickets', require('../routes/ticketRoutes'));

    // Event Routes
    this.app.use('/api/events', require('../routes/eventRoutes'));

    // Login Routes
    this.app.use('/api/login', require('../routes/logInRoutes'));

    // Login Routes
    this.app.use('/api/panel/login', require('../routes/adminLogInRoutes'));

    // Upload Images Routes
    this.app.use('/api/upload', require('../routes/uploadImagesRoutes'));

    // MercadoPago Checkout Routes
    this.app.use('/api/checkout', require('../routes/mercadopagoRoutes'));
  }
}

module.exports = Routes;