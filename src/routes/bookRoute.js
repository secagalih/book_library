import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getBooks, addBook, updateBook, getTotalBooks } from '../controller/bookController.js';
import { addBookSchema } from '../validator/booksValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';
const bookRouter = express.Router();


bookRouter.use(authMiddleware);

bookRouter.get('/', getBooks);

bookRouter.post('/add', validateRequest(addBookSchema), addBook);

bookRouter.post('/update', validateRequest(addBookSchema), updateBook);

bookRouter.get('/total-books',getTotalBooks);
export default bookRouter;