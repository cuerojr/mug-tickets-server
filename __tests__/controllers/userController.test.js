const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');

const Server = require('../../src/config/server');

const app = new Server();
const User = require('../../src/models/userModel');
const UserController = require('../../src/controllers/userController');

describe('UserController', () => {
  let mongoServer;
  let user;
  let token;

  beforeAll(async () => {
    mongoServer =  await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    // Create a user and generate a token for testing authenticated routes
    user = await User.create({
      dni: '12345678A',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
    });

    token = await UserController.generateJWT(user._id);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.uid).toBeDefined();
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const data = {
        dni: '12345678B',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password',
      };

      const response = await request(app)
        .post('/api/users')
        .send(data);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();

      // Verify that the user was actually created in the database
      const dbUser = await User.findOne({ email: data.email });

      expect(dbUser).toBeDefined();
      expect(dbUser.firstName).toBe(data.firstName);
      expect(dbUser.lastName).toBe(data.lastName);
    });

    it('should return an error if the email already exists', async () => {
      const data = {
        dni: '12345678C',
        firstName: 'Bob',
        lastName: 'Smith',
        email: user.email, // Use the same email as the pre-existing user
        password: 'password',
      };

      const response = await request(app)
        .post('/api/users')
        .send(data);

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBeDefined();
    });
  });

  describe('get', () => {
    it('should return a single user', async () => {
      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user._id).toBe(user._id.toString());
    });

    it('should return an error if the user is not found', async () => {
      const response = await request(app)
        .get('/api/users/invalid-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.ok).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const data = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(data);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user._id).toBe(user._id.toString());
      expect(response.body.user.firstName).toBe(data.firstName);
      expect(response.body.user.lastName).toBe(data.lastName);

      // Verify that the user was actually updated in the database
      const dbUser = await User.findById(user._id);

      expect(dbUser).toBeDefined();
      expect(dbUser.firstName).toBe(data.firstName);
      expect(dbUser.lastName).toBe(data.lastName);
    });

    it('should return an error if the user is not found', async () => {
      const data = {
        firstName: 'Invalid',
        lastName: 'User',
      };

      const response = await request(app)
        .put('/api/users/invalid-id')
        .set('Authorization', `Bearer ${token}`)
        .send(data);

      expect(response.status).toBe(404);
      expect(response.body.ok).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const response = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);

      // Verify that the user was actually deleted from the database
      const dbUser = await User.findById(user._id);

      expect(dbUser).toBeNull();
    });

    it('should return an error if the user is not found', async () => {
      const response = await request(app)
        .delete('/api/users/invalid-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.ok).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
});
