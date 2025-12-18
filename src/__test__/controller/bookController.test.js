import { describe, it, expect, jest, beforeEach } from '@jest/globals';


const mockDb = {
  oneOrNone: jest.fn(),
  one: jest.fn(),
  any: jest.fn(),
  many: jest.fn()
};


jest.unstable_mockModule('../../config/database.js', () => ({
  db: mockDb
}));

const { 
  getBooks, 
  addBook, 
  getTotalBooks 
} = await import('../../controller/bookController.js');
const db = mockDb;

describe('Book Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      query: {},
      body: {},
      params: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    jest.clearAllMocks();
  });

  describe('getBooks', () => {
    it('should get all books with pagination', async () => {
      mockReq.query = { page: '1', limit: '10' };

      const mockBooks = [
        { id: 1, title: 'Book 1', author: 'Author 1', isbn: '123', quantity: 5 },
        { id: 2, title: 'Book 2', author: 'Author 2', isbn: '456', quantity: 3 }
      ];

      db.any.mockResolvedValue(mockBooks);
      db.one.mockResolvedValue({ count: '2' });

      await getBooks(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: {
            books: mockBooks
          },
          pagination: expect.objectContaining({
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 2,
            totalPages: 1
          })
        })
      );
    });

    it('should search books by title, author, or ISBN', async () => {
      mockReq.query = { search: 'Harry', page: '1', limit: '10' };

      const mockBooks = [
        { id: 1, title: 'Harry Potter', author: 'J.K. Rowling', isbn: '789' }
      ];

      db.any.mockResolvedValue(mockBooks);
      db.one.mockResolvedValue({ count: '1' });

      await getBooks(mockReq, mockRes);

      expect(db.any).toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.arrayContaining(['%Harry%'])
      );
    });

  });

  describe('addBook', () => {
    it('should add a new book successfully', async () => {
      mockReq.body = {
        title: 'New Book',
        author: 'New Author',
        isbn: '1234567890',
        quantity: 10
      };

      const mockBook = {
        id: 1,
        title: 'New Book',
        author: 'New Author',
        isbn: '1234567890',
        quantity: 10
      };

      db.oneOrNone.mockResolvedValue(null);
      db.one.mockResolvedValue(mockBook);

      await addBook(mockReq, mockRes);

      expect(db.oneOrNone).toHaveBeenCalledWith(
        'SELECT * FROM "Book" WHERE "isbn" = $1',
        ['1234567890']
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'Book added successfully'
        })
      );
    });

    it('should reject duplicate ISBN', async () => {
      mockReq.body = {
        title: 'Duplicate Book',
        author: 'Author',
        isbn: '9999999999',
        quantity: 5
      };

      db.oneOrNone.mockResolvedValue({ id: 1, isbn: '9999999999' });

      await addBook(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'ISBN already exists'
      });
      expect(db.one).not.toHaveBeenCalled();
    });
  });


  describe('getTotalBooks', () => {
    it('should return total quantity of all books', async () => {
      db.one.mockResolvedValue({ total: '150' });

      await getTotalBooks(mockReq, mockRes);

      expect(db.one).toHaveBeenCalledWith('SELECT SUM("quantity") As total FROM "Book"');
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Total books found',
        data: {
          totalBooks: '150'
        }
      });
    });
  });
});