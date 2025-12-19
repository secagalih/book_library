import { db } from '../config/database.js';

const getBorrowings = async (req, res) => {
  const books = await db.many(`
    SELECT 
      b."id",
      b."title",
      b."author",
      b."isbn",
      b."quantity",
      br."borrowedAt",
      br."dueDate",
      br."returnedAt",
      br."borrowingStatus" as "status"
    FROM "Book" b
    INNER JOIN "Borrowing" br ON b."id" = br."bookId"
    WHERE br."userId" = $1 ORDER BY br."borrowedAt" DESC
  `, [req.user.id]);
  res.status(200).json({
    status: 'success',
    message: 'Borrowings found',
    data: {
      borrowedBooks: books
    }
  })
}
const addBorrowing = async (req, res) => {
  const { bookId, borrowedAt } = req.body;
  const duedate = new Date(borrowedAt);
  duedate.setDate(duedate.getDate() + 14);
  const userId = req.user.id || req.body.userId;
  const checkBook = await db.oneOrNone('SELECT * FROM "Book" WHERE "id" = $1', [bookId]);
  if (!checkBook) {
    return res.status(400).json({ status: 'error', message: 'Book not found' });
  }
  if (checkBook.quantity <= 0) {
    return res.status(400).json({ status: 'error', message: 'Book is not available' });
  }

  const borrowing = await db.one('INSERT INTO "Borrowing" ("userId", "bookId","borrowedAt", "dueDate" ) VALUES ($1, $2, $3, $4) RETURNING "borrowedAt", "dueDate"', [userId, bookId, borrowedAt, duedate]);

  const book = await db.one('UPDATE "Book" SET "quantity" = "quantity" - 1 WHERE "id" = $1 RETURNING "title", "author", "isbn"', [bookId]);

  if (!book) {
    return res.status(400).json({ status: 'error', message: 'Failed to update book' });
  }
  res.status(201).json({
    status: 'success',
    data: {
      duedate: borrowing.dueDate,
      borrowedAt: borrowing.borrowedAt,
      book: book,
    },
    message: 'Borrowing added successfully'
  })
}
const updateBorrowing = async (req, res) => {
  const { bookId, returnedAt, status } = req.body;
  const userId = req.user.id;

  const checkBorrowing = await db.oneOrNone('SELECT * FROM "Borrowing" WHERE "bookId" = $1 AND "userId" = $2 AND "returnedAt" IS NULL', [bookId, userId]);
  if (!checkBorrowing) {
    return res.status(400).json({ status: 'error', message: 'Borrowing not found or already returned' });
  }

  if (status === "RETURNED") {
    const book = await db.one('UPDATE "Book" SET "quantity" = "quantity" + 1 WHERE "id" = $1 RETURNING "title", "author", "isbn"', [bookId]);
    if (!book) {
      return res.status(400).json({ status: 'error', message: 'Failed to update book' });
    }
  }
  const borrowing = await db.one('UPDATE "Borrowing" SET "returnedAt" = $1, "borrowingStatus" = $2 WHERE "bookId" = $3 AND "userId" = $4 RETURNING *', [returnedAt, status, bookId, userId]);
  res.status(201).json({
    status: 'success',
    data: { borrowing: borrowing },
    message: 'Borrowing updated successfully'
  })
}

const getTotalBorrowings = async (req, res) => {
  const totalBorrowings = await db.one('SELECT COUNT(*) FROM "Borrowing"');
  res.status(200).json({
    status: 'success',
    data: {
      totalBorrowings: totalBorrowings.count
    }
  })
}



export { getBorrowings, addBorrowing, updateBorrowing, getTotalBorrowings };