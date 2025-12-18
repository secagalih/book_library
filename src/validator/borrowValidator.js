import z from 'zod';

const addBorrowSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required'),

});

export { addBorrowSchema };