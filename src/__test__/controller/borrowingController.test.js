import { describe, it, expect, jest, beforeEach } from '@jest/globals';


const mockDb = {
  oneOrNone: jest.fn(),
  one: jest.fn(),
  many: jest.fn()
};

jest.unstable_mockModule('../../config/database.js', () => ({
  db: mockDb
}));

const { getBorrowings, addBorrowing, getTotalBorrowings } = await import('../../controller/borrowController.js');
const db = mockDb;

describe('Borrowing Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {},
      user: { id: 1 } 
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getBorrowings', () => {
    it('should get all borrowings for a user', async () => {
      const mockBorrowings = [
        { id: 1, title: 'Book 1', author: 'Author 1', borrowedAt: '2024-01-01', status: 'BORROWED' },
        { id: 2, title: 'Book 2', author: 'Author 2', borrowedAt: '2024-01-02', status: 'BORROWED' }
      ];
      
      db.many.mockResolvedValue(mockBorrowings);
      
      await getBorrowings(mockReq, mockRes);
      
      expect(db.many).toHaveBeenCalledWith(
        expect.stringContaining('INNER JOIN "Borrowing"'),
        [1]  // req.user.id
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Borrowings found',
        data: {
          borrowedBooks: mockBorrowings
        }
      });
    });
  });

  describe('addBorrowing', () => {
    it('should add a borrowing successfully', async () => {
      mockReq.body = {
        bookId: 1,
        borrowedAt: '2024-01-01'
      };

      const mockBook = {
        id: 1,
        title: 'Test Book',
        quantity: 5
      };

      const mockBorrowing = {
        borrowedAt: '2024-01-01',
        dueDate: '2024-01-15'
      };

      const mockUpdatedBook = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '123'
      };

      db.oneOrNone.mockResolvedValue(mockBook);
      db.one.mockResolvedValueOnce(mockBorrowing)
            .mockResolvedValueOnce(mockUpdatedBook);

      await addBorrowing(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'Borrowing added successfully',
          data: expect.objectContaining({
            book: mockUpdatedBook
          })
        })
      );
    });

    it('should reject if book not found', async () => {
      mockReq.body = {
        bookId: 999,
        borrowedAt: '2024-01-01'
      };

      db.oneOrNone.mockResolvedValue(null);

      await addBorrowing(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Book not found'
      });
    });

    it('should reject if book quantity is 0', async () => {
      mockReq.body = {
        bookId: 1,
        borrowedAt: '2024-01-01'
      };

      db.oneOrNone.mockResolvedValue({
        id: 1,
        title: 'Book',
        quantity: 0
      });

      await addBorrowing(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Book is not available'
      });
    });
  });

  describe('getTotalBorrowings', () => {
    it('should return total borrowing count', async () => {
      db.one.mockResolvedValue({ count: '25' });

      await getTotalBorrowings(mockReq, mockRes);

      expect(db.one).toHaveBeenCalledWith('SELECT COUNT(*) FROM "Borrowing"');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          totalBorrowings: '25'
        }
      });
    });
  });

});