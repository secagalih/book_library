import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import jwt from 'jsonwebtoken';

// Create mock functions
const mockDb = {
  oneOrNone: jest.fn()
};

// Mock the database module
jest.unstable_mockModule('../../config/database.js', () => ({
  db: mockDb
}));

// Import after mocking
const { default: authMiddleware } = await import('../../middleware/authMiddleware.js');
const db = mockDb;

describe('Auth Middleware', () => {
  let mockReq, mockRes, mockNext;
  const testSecret = 'test-secret';

  beforeEach(() => {
    process.env.JWT_SECRET = testSecret;
    
    mockReq = {
      cookies: {},
      headers: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  it('should authenticate user with valid cookie token', async () => {
    const userId = 123;
    const token = jwt.sign({ id: userId }, testSecret);
    const mockUser = { id: userId, name: 'Test User', email: 'test@example.com' };

    mockReq.cookies.jwt = token;
    db.oneOrNone.mockResolvedValue(mockUser);

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(db.oneOrNone).toHaveBeenCalledWith(
      'SELECT * FROM "User" WHERE "id" = $1',
      [userId]
    );
    expect(mockReq.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should authenticate user with valid Bearer token', async () => {
    const userId = 456;
    const token = jwt.sign({ id: userId }, testSecret);
    const mockUser = { id: userId, name: 'Test User 2' };

    mockReq.headers.authorization = `Bearer ${token}`;
    db.oneOrNone.mockResolvedValue(mockUser);

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockReq.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should reject request without token', async () => {
    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject request with invalid token', async () => {
    mockReq.cookies.jwt = 'invalid-token';

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ 
      message: 'Not Authorized, Invalid Token' 
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject request if user not found in database', async () => {
    const userId = 999;
    const token = jwt.sign({ id: userId }, testSecret);
    
    mockReq.cookies.jwt = token;
    db.oneOrNone.mockResolvedValue(null);

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject undefined token string', async () => {
    mockReq.cookies.jwt = 'undefined';

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });
});