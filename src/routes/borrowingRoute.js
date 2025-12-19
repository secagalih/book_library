import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getBorrowings, addBorrowing, updateBorrowing, getTotalBorrowings } from '../controller/borrowController.js';
import { addBorrowSchema } from '../validator/borrowValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';
const borrowingRouter = express.Router();

borrowingRouter.use(authMiddleware);

borrowingRouter.get('/', getBorrowings);

borrowingRouter.post('/add', validateRequest(addBorrowSchema), addBorrowing);
borrowingRouter.post('/update', validateRequest(addBorrowSchema), updateBorrowing);
borrowingRouter.get('/total-borrowings', getTotalBorrowings);

export default borrowingRouter;