import { db } from '../config/database.js';

const getBooks = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  

  const pageNumber = Math.max(1, parseInt(page) || 1);
  const limitNumber = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const offset = (pageNumber - 1) * limitNumber;
  
  let query;
  let countQuery;
  let params = [];
  let countParams = [];
  
  if (search) {
    query = `
      SELECT * FROM "Book" 
      WHERE "title" ILIKE $1 
         OR "author" ILIKE $1 
         OR "isbn" ILIKE $1
      ORDER BY "title" ASC
      LIMIT $2 OFFSET $3
    `;
    params = [`%${search}%`, limitNumber, offset];
    
    countQuery = `
      SELECT COUNT(*) FROM "Book" 
      WHERE "title" ILIKE $1 
         OR "author" ILIKE $1 
         OR "isbn" ILIKE $1
    `;
    countParams = [`%${search}%`];
  } else {
    query = `
      SELECT * FROM "Book" 
      ORDER BY "title" ASC 
      LIMIT $1 OFFSET $2
    `;
    params = [limitNumber, offset];
    
    countQuery = 'SELECT COUNT(*) FROM "Book"';
    countParams = [];
  }
  

  const [books, countResult] = await Promise.all([
    db.any(query, params),
    db.one(countQuery, countParams)
  ]);
  
  const totalItems = parseInt(countResult.count);
  const totalPages = Math.ceil(totalItems / limitNumber);
  
  res.status(200).json({
    status: 'success',
    message: 'Books found',
    data: {
      books: books
    },
    pagination: {
      currentPage: pageNumber,
      itemsPerPage: limitNumber,
      totalItems: totalItems,
      totalPages: totalPages,
      hasNextPage: pageNumber < totalPages,
      hasPreviousPage: pageNumber > 1
    }
  });
}

const addBook = async (req, res) => {
  const { title, author, isbn, quantity } = req.body;

  const checkISBN = await db.oneOrNone('SELECT * FROM "Book" WHERE "isbn" = $1', [isbn]);
  if (checkISBN) {
    return res.status(400).json({status: 'error', message: 'ISBN already exists' });
  }
  const book = await db.one('INSERT INTO "Book" ("title", "author", "isbn", "quantity") VALUES ($1, $2, $3, $4) RETURNING *', [title, author, isbn, quantity]);
  res.status(201).json({
    status: 'success',
    message: 'Book added successfully',
    data: {
      book: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        quantity: book.quantity
      }
    },
    message: 'Book added successfully'
  })
}
const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, quantity } = req.body;
  const checkId = await db.oneOrNone('SELECT * FROM "Book" WHERE "id" = $1', [id]);
  if (!checkId) {
    return res.status(400).json({ status: 'error', message: 'Book not found' });
  }
  const book = await db.one('UPDATE "Book" SET "title" = $1, "author" = $2, "isbn" = $3, "quantity" = $4 WHERE "id" = $5 RETURNING *', [title, author, isbn, quantity, id]);
  res.status(201).json({
    status: 'success',
    message: 'Book updated successfully',
    data: {
      book: book
    },
    message: 'Book updated successfully'
  })
}
const deleteBook = async (req, res) => {
  const { id } = req.params;
  const checkId = await db.oneOrNone('SELECT * FROM "Book" WHERE "id" = $1', [id]);
  if (!checkId) {
    return res.status(400).json({ status: 'error', message: 'Book not found' });
  }
  await db.one('DELETE FROM "Book" WHERE "id" = $1 RETURNING *', [id]);
  res.status(201).json({
    status: 'success',
    message: 'Book deleted successfully'
  })
}

const getTotalBooks = async (req, res) => {
  const totalBooks = await db.one('SELECT SUM("quantity") As total FROM "Book"');
  
  res.status(201).json({
    status: 'success',
    message: 'Total books found',
    data: {
      totalBooks: totalBooks.total
    }
  })
}

export { getBooks, addBook, updateBook, deleteBook, getTotalBooks };