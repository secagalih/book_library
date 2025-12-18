import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { generateToken } from '../../utils/generateToken.js';

describe('generateToken Utility', () => {
  let mockRes;
  const originalEnv = process.env;

  beforeEach(() => {

    process.env = { 
      ...originalEnv, 
      JWT_SECRET: 'test-secret-key',
      JWT_EXPIRES_IN: '7d',
      NODE_ENV: 'test'
    };
    
    mockRes = {
      cookie: jest.fn()
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should generate a valid JWT token', () => {
    const userId = 123;
    const token = generateToken(userId, mockRes);


    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe(userId);
  });

  it('should set HTTP-only cookie with correct options', () => {
    const userId = 456;
    generateToken(userId, mockRes);

    expect(mockRes.cookie).toHaveBeenCalledWith(
      'jwt',
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        secure: true, // true in test environment (not 'development')
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
    );
  });

  it('should set secure flag to false in development', () => {
    process.env.NODE_ENV = 'development';
    const userId = 789;
    
    generateToken(userId, mockRes);

    expect(mockRes.cookie).toHaveBeenCalledWith(
      'jwt',
      expect.any(String),
      expect.objectContaining({
        secure: false
      })
    );
  });

  it('should set secure flag to true in production', () => {
    process.env.NODE_ENV = 'production';
    const userId = 890;
    
    generateToken(userId, mockRes);

    expect(mockRes.cookie).toHaveBeenCalledWith(
      'jwt',
      expect.any(String),
      expect.objectContaining({
        secure: true
      })
    );
  });

  it('should use default expiration if JWT_EXPIRES_IN not set', () => {
    delete process.env.JWT_EXPIRES_IN;
    const userId = 999;
    
    const token = generateToken(userId, mockRes);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    expect(decoded.exp).toBeDefined();
  });
});