import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getBorrowings, addBorrowing, updateBorrowing, deleteBorrowing, getTotalBorrowings } from '../controller/borrowController.js';
import { addBorrowSchema } from '../validator/borrowValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';
const borrowingRouter = express.Router();

borrowingRouter.use(authMiddleware);

borrowingRouter.get('/', getBorrowings);

borrowingRouter.post('/add', validateRequest(addBorrowSchema), addBorrowing);
borrowingRouter.post('/update', validateRequest(addBorrowSchema), updateBorrowing);
borrowingRouter.post('/delete/:id', validateRequest(addBorrowSchema), deleteBorrowing);
borrowingRouter.get('/total-borrowings', getTotalBorrowings);

export default borrowingRouter;