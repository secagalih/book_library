import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

const pgp = pgPromise({});

// You need to set your DATABASE_URL in .env file
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env file!');
  process.exit(1);
}

const db = pgp({
  connectionString: process.env.DATABASE_URL,
});

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database tables...\n');
    
    // Create User table
    await db.none(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created User table');
    
    // Create Book table
    await db.none(`
      CREATE TABLE IF NOT EXISTS "Book" (
        "id" TEXT PRIMARY KEY,
        "title" TEXT NOT NULL,
        "author" TEXT NOT NULL,
        "isbn" TEXT NOT NULL UNIQUE,
        "quantity" INTEGER NOT NULL DEFAULT 1,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created Book table');
    
    // Create BorrowingStatus enum
    await db.none(`
      DO $$ BEGIN
        CREATE TYPE "BorrowingStatus" AS ENUM ('BORROWED', 'RETURNED', 'OVERDUE', 'LOST');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✅ Created BorrowingStatus enum');
    
    // Create Borrowing table
    await db.none(`
      CREATE TABLE IF NOT EXISTS "Borrowing" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "bookId" TEXT NOT NULL,
        "borrowedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "dueDate" TIMESTAMP NOT NULL,
        "returnedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "borrowingStatus" "BorrowingStatus" NOT NULL DEFAULT 'BORROWED',
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
        FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE
      );
    `);
    console.log('✅ Created Borrowing table');
    
    console.log('\n🎉 Database setup complete!');
    
    // Verify tables were created
    const tables = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Tables in database:');
    tables.forEach(t => console.log(`  - ${t.table_name}`));
    
    await db.$pool.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Make sure:');
    console.error('  1. PostgreSQL is running');
    console.error('  2. DATABASE_URL is set in .env file');
    console.error('  3. The database exists (create it with: createdb book_library_dev)');
    process.exit(1);
  }
}

setupDatabase();

