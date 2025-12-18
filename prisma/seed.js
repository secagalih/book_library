import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780-0-7432-7356-5',
    quantity: 10,
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780-0-06-112008-4',
    quantity: 10
  },
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '9780-0-452-28423-4',
    quantity: 10
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '9780-0-14-143951-8',
    quantity: 10
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '9780-316-76948-0',
    quantity: 10
  },
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling',
    isbn: '9780-590-35340-3',
    quantity: 10
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    isbn: '9780-7432-7357-1',
    quantity: 0
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '9780-7432-7357-2',
    quantity: 0
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    isbn: '9780-7432-7357-3',
    quantity: 1
  },
  {
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    isbn: '9780-7432-7357-4',
    quantity: 1
  },
]

const main = async () => {
  console.log('Seeding books...');
  for (const book of books) {
    await prisma.book.create({
      data: book
    })
    console.log(`Book ${book.title} created`);
  }
  console.log('Books seeded successfully');
}

main().catch((error) => {
  console.error('Error seeding books:', error);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});