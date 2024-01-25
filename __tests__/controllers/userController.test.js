import { UserController } from './../../src/controllers/userController';
import { User } from './../../src/models/userModel';
import { generateJWT } from './../../src/config/authentication';
import { jest } from '@jest/globals';

// Mocking dependencies
//jest.mock('./../../src/models/userModel');
jest.mock('./../../src/config/authentication');

describe('UserController', () => {
  let userController;

  beforeEach(() => {
    userController = new UserController();
  });

  describe('getAll', () => {
    it('should get all users successfully', async () => {
      // Mocking User.find to resolve with mock users
      const mockUsers = [{
        firstName: "Tito",
        lastName: "Cosa",
        password: "asdasdadasdasd",
        email: "asd@ass.com",
        dni: 3132970
      }];
      jest.spyOn(User, 'find').mockResolvedValue(mockUsers);

      // Mocking response object
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Calling the method
      await userController.getAll({}, mockResponse);

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        ok: true,
        users: mockUsers,
      });
    });

    /*it('should handle error when fetching users', async () => {
      // Mocking User.find to reject with an error
      const errorMessage = 'Mocked error message';

      // Clear any previous mocks
      User.find.mockClear();

      jest.spyOn(User, 'find').mockRejectedValue(new Error(errorMessage));

      // Mocking response object
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Calling the method
      await userController.getAll({}, mockResponse);

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        ok: false,
        error: 'Unable to fetch ticket information',
      });
    });*/
  });

  // Add similar describe blocks for other methods (filter, create, get, update, delete)
});
