import z from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, 'Name must be less than 50 characters'),
  email: z.email().min(1,
    'Email is required'
  ),
  password: z.string().min(1,
    'Password is required'
  ).max(50),
});

const loginSchema = z.object({
  email: z.email().min(1,
    'Email is required'
  ),
  password: z.string().min(1,
    'Password is required'
  ).max(50,
    'Password must be less than 50 characters'
  ),
});

export { registerSchema, loginSchema };