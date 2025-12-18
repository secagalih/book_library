import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import bcrypt from 'bcrypt';


const mockDb = {
  oneOrNone: jest.fn(),
  one: jest.fn()
};

const mockGenerateToken = jest.fn();


jest.unstable_mockModule('../../config/database.js', () => ({
  db: mockDb
}));

jest.unstable_mockModule('../../utils/generateToken.js', () => ({
  generateToken: mockGenerateToken
}));

const { register, login, logout, getUser, getTotalUsers } = await import('../../controller/authController.js');
const db = mockDb;
const generateToken = mockGenerateToken;

describe('Auth Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: {},
      cookies: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };
    
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockReq.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      };

      db.oneOrNone.mockResolvedValue(null); 
      db.one.mockResolvedValue(mockUser);
      generateToken.mockReturnValue('mock-token');

      await register(mockReq, mockRes);

      expect(db.oneOrNone).toHaveBeenCalledWith(
        'SELECT * FROM "User" WHERE "email" = $1',
        ['john@example.com']
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'Registered successfully',
          data: expect.objectContaining({
            user: expect.objectContaining({
              email: 'john@example.com'
            }),
            token: 'mock-token'
          })
        })
      );
    });

    it('should reject registration if user already exists', async () => {
      mockReq.body = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123'
      };

      db.oneOrNone.mockResolvedValue({ id: 1, email: 'jane@example.com' });

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'User already exists'
      });
    });

    it('should hash password before storing', async () => {
      mockReq.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'plaintext'
      };

      db.oneOrNone.mockResolvedValue(null);
      db.one.mockResolvedValue({ id: 1, name: 'Test User' });
      generateToken.mockReturnValue('token');

      await register(mockReq, mockRes);

      const insertCall = db.one.mock.calls[0];
      expect(insertCall[1][2]).not.toBe('plaintext');
      expect(insertCall[1][2].length).toBeGreaterThan(20); 
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      mockReq.body = {
        email: 'john@example.com',
        password: 'password123'
      };

      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: 1,
        email: 'john@example.com',
        password: hashedPassword
      };

      db.oneOrNone.mockResolvedValue(mockUser);
      generateToken.mockReturnValue('login-token');

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'Logged in successfully',
          data: expect.objectContaining({
            token: 'login-token'
          })
        })
      );
    });

    it('should reject login with invalid email', async () => {
      mockReq.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      db.oneOrNone.mockResolvedValue(null);

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Invalid Email and Password'
      });
    });

    it('should reject login with invalid password', async () => {
      mockReq.body = {
        email: 'john@example.com',
        password: 'wrongpassword'
      };

      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      const mockUser = {
        id: 1,
        email: 'john@example.com',
        password: hashedPassword
      };

      db.oneOrNone.mockResolvedValue(mockUser);

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Invalid Password and Email'
      });
    });
  });

  describe('logout', () => {
    it('should clear JWT cookie on logout', async () => {
      await logout(mockReq, mockRes);

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'jwt',
        '',
        expect.objectContaining({
          httpOnly: true,
          expires: expect.any(Date)
        })
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Logged out successfully'
      });
    });
  });

  describe('getUser', () => {
    it('should return user data for authenticated user', async () => {
      mockReq.user = { id: 1 };
      mockReq.cookies.jwt = 'valid-token';

      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      };

      db.oneOrNone.mockResolvedValue(mockUser);

      await getUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'User found',
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com'
        }
      });
    });

    it('should return error if user not found', async () => {
      mockReq.user = { id: 999 };
      mockReq.cookies.jwt = 'token';

      db.oneOrNone.mockResolvedValue(null);

      await getUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Invalid token'
      });
    });
  });

  describe('getTotalUsers', () => {
    it('should return total user count', async () => {
      db.one.mockResolvedValue({ count: '42' });

      await getTotalUsers(mockReq, mockRes);

      expect(db.one).toHaveBeenCalledWith('SELECT COUNT(*) FROM "User"');
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Total users found',
        data: {
          totalUsers: '42'
        }
      });
    });
  });
});