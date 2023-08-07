const mongoose = require('mongoose');
const Database = require('./../../src/config/db');

// Load environment variables from .env file (if any)
require('dotenv').config();

describe('Database', () => {
  let db;

  beforeAll(() => {
    db = new Database();
  });

  afterAll(async () => {
    // Close the MongoDB connection after all tests are done
    await mongoose.disconnect();
  });

  it('should connect to the database', async () => {
    // Attempt to connect to the database
    await db.connectDB();

    // Check if the connection state is 'connected'
    expect(mongoose.connection.readyState).toBe(1);
  });

});