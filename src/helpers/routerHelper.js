const express = require('express');

class RouteLibrary {
  constructor(app) {
    this.app = app;
  }

  setupRoutes() {
    this.app.use('/api/users', require('../routes/userRoutes'));
    this.app.use('/api/admin', require('../routes/adminRoutes'));
    this.app.use('/api/tickets', require('../routes/ticketRoutes'));
    this.app.use('/api/events', require('../routes/eventRoutes'));
    this.app.use('/api/login', require('../routes/logInRoutes'));
    this.app.use('/api/upload', require('../routes/uploadImagesRoutes'));
    this.app.use('/api/checkout', require('../routes/mercadopagoRoutes'));
  }
}

module.exports = RouteLibrary;