import { Server } from './src/config/server.js';

// Singleton implementation
class SingletonServer {
    constructor() {
      if (!SingletonServer.instance) {
        SingletonServer.instance = new Server();
      }
    }
  
    getInstance() {
      return SingletonServer.instance;
    }
  }
  
  const singletonServer = new SingletonServer();
  const server = singletonServer.getInstance();
  server.listen();