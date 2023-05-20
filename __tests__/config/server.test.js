const request = require('supertest');
const Server =  require('./../../src/config/server');

describe('Server', () => {
  describe('constructor', () => {
    test('should create a new instance', () => {
      const server = new Server();

      expect(server).toBeDefined();
      expect(server).toBeInstanceOf(Server);
    });

    test('should set default values', () => {
      const server = new Server();
        console.log(server.port.env)
      expect(server.host).toBe('localhost');
      expect(server.port).toBe('8080');
    });

    test('should set provided values', () => {
      const server = new Server('127.0.0.1', 8080, 'production');

      expect(server.host).toBe('127.0.0.1');
      expect(server.port).toBe(8080);
      expect(server.env).toBe('production');
    });
  });

  describe('start', () => {
    test('should start the server', async () => {
      const server = new Server();
      const result = await server.start();

      expect(result).toBe(true);
      expect(server.server).toBeDefined();
      expect(server.server.listening).toBe(true);

      await server.stop(); // Clean up after the test
    });
  });

  describe('stop', () => {
    test('should stop the server', async () => {
      const server = new Server();
      await server.start();

      const result = await server.stop();

      expect(result).toBe(true);
      expect(server.server).toBeUndefined();
    });
  });
});
