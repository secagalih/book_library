import z from 'zod';

const addBookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  quantity: z.number().min(1, 'Quantity is required'),
});

export { addBookSchema };