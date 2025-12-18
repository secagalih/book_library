import pgPromise from 'pg-promise';
import dotenv from 'dotenv';
dotenv.config();
const pgp = pgPromise({});

const db = pgp(
  {
    connectionString: process.env.DATABASE_URL,
  }
)

const checkDatabaseConnection = async () => {
  try {
    const result = await db.query('SELECT current_database(), current_user');
    console.log('✅ Connected to database query successful');
    console.log(`📊 Database: ${result[0].current_database}`);
    console.log(`👤 User: ${result[0].current_user}`);
    
    const allTables = await db.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_type = 'BASE TABLE'
        AND table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name;
    `);
    
    console.log('\n📋 All tables in database:');
    if (allTables.length === 0) {
      console.log('   ⚠️  No tables found in any schema!');
    } else {
      const bySchema = {};
      allTables.forEach(t => {
        if (!bySchema[t.table_schema]) bySchema[t.table_schema] = [];
        bySchema[t.table_schema].push(t.table_name);
      });
      
      Object.keys(bySchema).forEach(schema => {
        console.log(`\n   Schema: ${schema}`);
        bySchema[schema].forEach(table => console.log(`      - ${table}`));
      });
    }
    console.log('');
    
  } catch (err) {
    console.error('❌ Error connecting to database: ' + err.message, err);
    process.exit(1);
  }

}

const disconnectDB = async () => {
  await db.end();
  console.log('✅ Disconnected from database');
}

const createTablesIfNotExist = async () => {
  try {
    console.log('🔧 Checking/Creating tables...');
    
    await db.none(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    
    console.log('✅ User table ready');
    

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
    console.log('✅ Book table ready');
    
    await db.none(`
      DO $$ BEGIN
        CREATE TYPE "BorrowingStatus" AS ENUM ('BORROWED', 'RETURNED', 'OVERDUE', 'LOST');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✅ BorrowingStatus enum ready');
    
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
    console.log('✅ Borrowing table ready');
    console.log('🎉 All tables ready!\n');
    
  } catch (err) {
    console.error('❌ Error creating tables:', err.message);
    throw err;
  }
}


export { db, checkDatabaseConnection, disconnectDB, createTablesIfNotExist };