# SQL Joins and JSON Aggregation - Complete Guide for Beginners

## Overview

This document is a comprehensive guide to SQL queries, starting from basics and building up to advanced concepts like JOINs and JSON aggregation. Whether you're new to SQL or need a refresher, this guide will help you understand how databases work.

---

## 📚 Table of Contents

1. [SQL Basics for Beginners](#sql-basics-for-beginners)
2. [Understanding JOINs](#understanding-joins)
3. [Advanced: JSON Aggregation](#advanced-json-aggregation)
4. [Real-World Examples](#real-world-examples)
5. [Common Mistakes](#common-mistakes)
6. [Quick Reference](#quick-reference)

---

## 📖 SQL Basics for Beginners

### What is SQL?

**SQL** (Structured Query Language) is the language we use to talk to databases. Think of it as giving instructions to a librarian:
- "Show me all books" → `SELECT * FROM Book`
- "Show me books by George Orwell" → `SELECT * FROM Book WHERE author = 'George Orwell'`

---

### Understanding Database Tables

A table is like a spreadsheet with rows and columns:

```
Book Table
┌────────────┬───────────────────┬──────────────────┬──────────────┬──────────┐
│ id         │ title             │ author           │ isbn         │ quantity │
├────────────┼───────────────────┼──────────────────┼──────────────┼──────────┤
│ b1         │ 1984              │ George Orwell    │ 978-0451524  │ 5        │
│ b2         │ The Great Gatsby  │ F. S. Fitzgerald │ 978-0743273  │ 3        │
│ b3         │ Moby Dick         │ Herman Melville  │ 978-1503280  │ 2        │
└────────────┴───────────────────┴──────────────────┴──────────────┴──────────┘

- Each ROW = One book
- Each COLUMN = One piece of information (title, author, etc.)
- PRIMARY KEY (id) = Unique identifier for each row
```

---

### Basic SQL Query Structure

Every SQL query follows a pattern:

```sql
SELECT [what columns you want]
FROM [which table]
WHERE [conditions to filter]
ORDER BY [how to sort]
LIMIT [how many results]
```

---

### 1. SELECT - Getting Data

#### Get ALL columns
```sql
SELECT * FROM "Book"
```
- `*` means "all columns"
- Returns everything from the Book table

**Result:**
```
┌────┬──────────────────┬──────────────────┬──────────────┬──────────┐
│ id │ title            │ author           │ isbn         │ quantity │
├────┼──────────────────┼──────────────────┼──────────────┼──────────┤
│ b1 │ 1984             │ George Orwell    │ 978-0451524  │ 5        │
│ b2 │ The Great Gatsby │ F. S. Fitzgerald │ 978-0743273  │ 3        │
└────┴──────────────────┴──────────────────┴──────────────┴──────────┘
```

#### Get SPECIFIC columns
```sql
SELECT "title", "author" FROM "Book"
```
- Only returns the columns you specify
- More efficient than `SELECT *`

**Result:**
```
┌──────────────────┬──────────────────┐
│ title            │ author           │
├──────────────────┼──────────────────┤
│ 1984             │ George Orwell    │
│ The Great Gatsby │ F. S. Fitzgerald │
└──────────────────┴──────────────────┘
```

#### Get DISTINCT values (no duplicates)
```sql
SELECT DISTINCT "author" FROM "Book"
```
- Returns each author only once, even if they wrote multiple books

---

### 2. WHERE - Filtering Data

The `WHERE` clause filters which rows you want. Think of it as "IF" conditions.

#### Basic Comparison Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `=` | Equal to | `WHERE quantity = 5` |
| `!=` or `<>` | Not equal to | `WHERE quantity != 0` |
| `>` | Greater than | `WHERE quantity > 3` |
| `<` | Less than | `WHERE quantity < 10` |
| `>=` | Greater or equal | `WHERE quantity >= 5` |
| `<=` | Less or equal | `WHERE quantity <= 10` |

#### Examples:

**Get books with more than 3 copies:**
```sql
SELECT * FROM "Book" 
WHERE "quantity" > 3
```

**Result:**
```
┌────┬───────┬───────────────┬──────────┐
│ id │ title │ author        │ quantity │
├────┼───────┼───────────────┼──────────┤
│ b1 │ 1984  │ George Orwell │ 5        │
└────┴───────┴───────────────┴──────────┘
```

**Get a specific book by title:**
```sql
SELECT * FROM "Book" 
WHERE "title" = '1984'
```

**Important:** 
- Use single quotes `'value'` for text/strings
- Use no quotes for numbers: `WHERE quantity = 5`

---

### 3. Logical Operators - Combining Conditions

Use `AND`, `OR`, `NOT` to combine multiple conditions:

#### AND - Both conditions must be true

```sql
SELECT * FROM "Book" 
WHERE "author" = 'George Orwell' 
  AND "quantity" > 3
```

**Means:** "Books by George Orwell AND have more than 3 copies"

**Visual:**
```
Condition 1: author = 'George Orwell'  →  TRUE or FALSE
              AND
Condition 2: quantity > 3              →  TRUE or FALSE

Result: Only rows where BOTH are TRUE
```

#### OR - At least one condition must be true

```sql
SELECT * FROM "Book" 
WHERE "author" = 'George Orwell' 
   OR "author" = 'Herman Melville'
```

**Means:** "Books by George Orwell OR Herman Melville (or both)"

#### NOT - Negate a condition

```sql
SELECT * FROM "Book" 
WHERE NOT "author" = 'George Orwell'
```

**Means:** "Books NOT written by George Orwell"

---

### 4. Common WHERE Patterns

#### Pattern Matching with LIKE

```sql
-- Find books with "Great" in the title
SELECT * FROM "Book" 
WHERE "title" LIKE '%Great%'
```

**Wildcards:**
- `%` = any number of characters
- `_` = exactly one character

**Examples:**
```sql
-- Starts with "The"
WHERE "title" LIKE 'The%'     → "The Great Gatsby", "The Hobbit"

-- Ends with "Dick"
WHERE "title" LIKE '%Dick'    → "Moby Dick"

-- Contains "great" (case-sensitive)
WHERE "title" LIKE '%great%'  → "The great adventure"

-- Case-insensitive (PostgreSQL)
WHERE "title" ILIKE '%GREAT%' → "The Great Gatsby", "great expectations"
```

#### Checking for NULL

```sql
-- Find books with no ISBN
SELECT * FROM "Book" 
WHERE "isbn" IS NULL

-- Find books that HAVE an ISBN
SELECT * FROM "Book" 
WHERE "isbn" IS NOT NULL
```

**⚠️ Important:** 
- Use `IS NULL`, NOT `= NULL`
- `WHERE column = NULL` will **never work**!

#### IN - Check multiple values

```sql
-- Books by any of these authors
SELECT * FROM "Book" 
WHERE "author" IN ('George Orwell', 'Herman Melville', 'Jane Austen')
```

Equivalent to:
```sql
WHERE "author" = 'George Orwell' 
   OR "author" = 'Herman Melville' 
   OR "author" = 'Jane Austen'
```

#### BETWEEN - Range of values

```sql
-- Books with 3 to 10 copies
SELECT * FROM "Book" 
WHERE "quantity" BETWEEN 3 AND 10
```

Equivalent to:
```sql
WHERE "quantity" >= 3 AND "quantity" <= 10
```

---

### 5. ORDER BY - Sorting Results

```sql
-- Sort by title (A to Z)
SELECT * FROM "Book" 
ORDER BY "title" ASC

-- Sort by quantity (highest first)
SELECT * FROM "Book" 
ORDER BY "quantity" DESC

-- Sort by multiple columns
SELECT * FROM "Book" 
ORDER BY "author" ASC, "title" ASC
```

**ASC vs DESC:**
- `ASC` = Ascending (A→Z, 0→9, oldest→newest) - **DEFAULT**
- `DESC` = Descending (Z→A, 9→0, newest→oldest)

---

### 6. LIMIT and OFFSET - Pagination

#### LIMIT - Maximum number of results

```sql
-- Get only 5 books
SELECT * FROM "Book" 
LIMIT 5
```

#### OFFSET - Skip first N results

```sql
-- Skip first 10 books, show next 5
SELECT * FROM "Book" 
LIMIT 5 OFFSET 10
```

#### Pagination Example

```sql
-- Page 1: Show first 10 books
SELECT * FROM "Book" 
LIMIT 10 OFFSET 0

-- Page 2: Skip 10, show next 10
SELECT * FROM "Book" 
LIMIT 10 OFFSET 10

-- Page 3: Skip 20, show next 10
SELECT * FROM "Book" 
LIMIT 10 OFFSET 20

-- Formula: OFFSET = (page_number - 1) × items_per_page
```

---

### 7. Parameter Placeholders - Preventing SQL Injection

**❌ NEVER do this:**
```javascript
// DANGEROUS! Vulnerable to SQL injection
const query = `SELECT * FROM "Book" WHERE "title" = '${userInput}'`;
```

**✅ Always use parameters:**
```javascript
// SAFE! Protected against SQL injection
const query = 'SELECT * FROM "Book" WHERE "title" = $1';
const result = await db.any(query, [userInput]);
```

**How it works:**
```sql
-- In your SQL query
WHERE "bookId" = $1 AND "userId" = $2

-- In your JavaScript
const params = [bookId, userId];
await db.one(query, params);

-- PostgreSQL substitutes:
-- $1 → first value in params array (bookId)
-- $2 → second value in params array (userId)
```

**Why use parameters?**
1. **Security:** Prevents SQL injection attacks
2. **Type safety:** Database validates the type
3. **Performance:** Query can be cached and reused

---

### 8. Aggregate Functions - Calculations

#### COUNT - Count rows

```sql
-- How many books total?
SELECT COUNT(*) FROM "Book"

-- How many books have quantity > 3?
SELECT COUNT(*) FROM "Book" 
WHERE "quantity" > 3

-- Count distinct authors
SELECT COUNT(DISTINCT "author") FROM "Book"
```

#### SUM - Add up numbers

```sql
-- Total quantity of all books
SELECT SUM("quantity") FROM "Book"

-- Returns: { sum: 10 }
```

**Note:** The column name in the result is `sum`. To change it:
```sql
SELECT SUM("quantity") AS "totalBooks" FROM "Book"
-- Returns: { totalBooks: 10 }
```

#### AVG - Average

```sql
-- Average quantity per book
SELECT AVG("quantity") FROM "Book"
```

#### MIN and MAX

```sql
-- Lowest quantity
SELECT MIN("quantity") FROM "Book"

-- Highest quantity
SELECT MAX("quantity") FROM "Book"
```

---

### 9. GROUP BY - Grouping Data

Use `GROUP BY` to group rows and calculate aggregates for each group.

**Example: Count books by each author**

```sql
SELECT "author", COUNT(*) as "bookCount"
FROM "Book"
GROUP BY "author"
```

**Result:**
```
┌──────────────────┬───────────┐
│ author           │ bookCount │
├──────────────────┼───────────┤
│ George Orwell    │ 2         │
│ Herman Melville  │ 1         │
│ F. S. Fitzgerald │ 1         │
└──────────────────┴───────────┘
```

**How it works:**
```
Original Table:
┌─────────────┬──────────────────┐
│ author      │ title            │
├─────────────┼──────────────────┤
│ G. Orwell   │ 1984             │  ┐
│ G. Orwell   │ Animal Farm      │  ├─ Grouped together
└─────────────┴──────────────────┘  ┘

│ H. Melville │ Moby Dick        │  ← One group

After GROUP BY:
┌─────────────┬───────────┐
│ author      │ count     │
├─────────────┼───────────┤
│ G. Orwell   │ 2         │
│ H. Melville │ 1         │
└─────────────┴───────────┘
```

**Important Rule:**
- Every column in SELECT must EITHER be:
  - In GROUP BY clause, OR
  - Inside an aggregate function (COUNT, SUM, AVG, etc.)

**✅ Correct:**
```sql
SELECT "author", COUNT(*), AVG("quantity")
FROM "Book"
GROUP BY "author"
```
- `author` is in GROUP BY ✓
- `COUNT(*)` is an aggregate ✓
- `AVG("quantity")` is an aggregate ✓

**❌ Wrong:**
```sql
SELECT "author", "title", COUNT(*)
FROM "Book"
GROUP BY "author"
```
- `title` is NOT in GROUP BY ✗
- `title` is NOT an aggregate ✗

---

### 10. INSERT - Adding Data

```sql
-- Add a new book
INSERT INTO "Book" ("title", "author", "isbn", "quantity") 
VALUES ('1984', 'George Orwell', '978-0451524', 5)
```

**With RETURNING (get the inserted row):**
```sql
INSERT INTO "Book" ("title", "author", "isbn", "quantity") 
VALUES ('1984', 'George Orwell', '978-0451524', 5)
RETURNING *
```

---

### 11. UPDATE - Modifying Data

```sql
-- Update quantity of a book
UPDATE "Book" 
SET "quantity" = 10 
WHERE "id" = 'b1'
```

**Multiple columns:**
```sql
UPDATE "Book" 
SET "quantity" = 10, 
    "title" = 'Nineteen Eighty-Four'
WHERE "id" = 'b1'
```

**⚠️ Warning:** Without WHERE, ALL rows are updated!
```sql
UPDATE "Book" SET "quantity" = 0  -- Updates EVERY book!
```

---

### 12. DELETE - Removing Data

```sql
-- Delete a specific book
DELETE FROM "Book" 
WHERE "id" = 'b1'
```

**⚠️ Warning:** Without WHERE, ALL rows are deleted!
```sql
DELETE FROM "Book"  -- Deletes EVERY book!
```

---

### 13. Common Mistakes and How to Fix Them

#### Mistake 1: Confusing = with ==

**❌ Wrong:**
```sql
WHERE "quantity" == 5  -- Wrong! Not JavaScript!
```

**✅ Correct:**
```sql
WHERE "quantity" = 5   -- Use single =
```

---

#### Mistake 2: Using = NULL instead of IS NULL

**❌ Wrong:**
```sql
WHERE "returnedAt" = NULL  -- Will never work!
```

**✅ Correct:**
```sql
WHERE "returnedAt" IS NULL
```

**Why?** In SQL, `NULL` means "unknown". You can't compare to unknown with `=`.

---

#### Mistake 3: Forgetting quotes around strings

**❌ Wrong:**
```sql
WHERE "author" = George Orwell  -- PostgreSQL thinks these are column names!
```

**✅ Correct:**
```sql
WHERE "author" = 'George Orwell'  -- Use single quotes for strings
```

---

#### Mistake 4: Column name in WHERE not in GROUP BY

**❌ Wrong:**
```sql
SELECT "author", "title", COUNT(*)
FROM "Book"
GROUP BY "author"  -- Error! title not in GROUP BY
```

**✅ Correct:**
```sql
SELECT "author", COUNT(*)
FROM "Book"
GROUP BY "author"
```

---

#### Mistake 5: Missing WHERE with conditionals

**❌ Wrong:**
```sql
SELECT * FROM "Borrowing" 
"bookId" = $1 AND "userId" = $2  -- Missing WHERE!
```

**✅ Correct:**
```sql
SELECT * FROM "Borrowing" 
WHERE "bookId" = $1 AND "userId" = $2
```

---

#### Mistake 6: Using column name alone in WHERE

**❌ Wrong:**
```sql
WHERE "bookId" AND "userId" = $1  -- "bookId" is not a boolean!
```

**✅ Correct:**
```sql
WHERE "bookId" = $1 AND "userId" = $2
```

**Explanation:**
- `WHERE` needs boolean expressions (true/false)
- `"bookId"` alone is just a column name, not a comparison
- You must use: `column operator value`

---

### 14. PostgreSQL-Specific Features

#### Case-Insensitive Search: ILIKE

```sql
-- Case-sensitive (won't find "great")
WHERE "title" LIKE '%Great%'

-- Case-insensitive (finds "great", "GREAT", "Great")
WHERE "title" ILIKE '%Great%'
```

#### String Concatenation

```sql
-- Combine first and last name
SELECT "firstName" || ' ' || "lastName" as "fullName"
FROM "User"
```

#### COALESCE - Handle NULL values

```sql
-- If quantity is NULL, use 0 instead
SELECT "title", COALESCE("quantity", 0) as "quantity"
FROM "Book"
```

---

### 15. Quick Reference: SQL Syntax

```sql
-- Basic Query Structure
SELECT [columns]
FROM [table]
WHERE [conditions]
GROUP BY [columns]
HAVING [conditions on groups]
ORDER BY [columns]
LIMIT [number] OFFSET [number]

-- Comparison Operators
=, !=, <>, >, <, >=, <=

-- Logical Operators
AND, OR, NOT

-- Pattern Matching
LIKE, ILIKE, NOT LIKE

-- NULL Checking
IS NULL, IS NOT NULL

-- Range
BETWEEN value1 AND value2

-- List
IN (value1, value2, value3)

-- Wildcards
% = any characters
_ = one character

-- Aggregate Functions
COUNT(*), SUM(column), AVG(column), MIN(column), MAX(column)

-- String Functions
LOWER(column), UPPER(column), column || 'text'
```

---

## 🎯 The Goal

**What we want to achieve:**
- Get a list of all users
- Include each user's borrowed books as a JSON array
- Show users even if they haven't borrowed any books (empty array)
- Include book details: title, author, borrowing dates, status

**Example output:**
```json
{
  "users": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "borrowedBooks": [
        {
          "bookId": "uuid-123",
          "title": "1984",
          "author": "George Orwell",
          "borrowedAt": "2024-01-15T00:00:00.000Z",
          "dueDate": "2024-01-29T00:00:00.000Z",
          "returnedAt": null,
          "status": "BORROWED"
        }
      ]
    },
    {
      "name": "Jane Smith",
      "email": "jane@example.com",
      "createdAt": "2024-01-02T00:00:00.000Z",
      "borrowedBooks": []
    }
  ]
}
```

---

## 📊 Database Schema

### Tables Involved

```sql
User Table
┌────────────┬──────────┬────────────────┬──────────┬───────────────────────┐
│ id (UUID)  │ name     │ email          │ password │ createdAt             │
├────────────┼──────────┼────────────────┼──────────┼───────────────────────┤
│ u1         │ John Doe │ john@email.com │ ******   │ 2024-01-01T00:00:00Z  │
│ u2         │ Jane S.  │ jane@email.com │ ******   │ 2024-01-02T00:00:00Z  │
└────────────┴──────────┴────────────────┴──────────┴───────────────────────┘

Borrowing Table
┌────────────┬────────────┬────────────┬───────────────────────┬───────────────────────┬─────────────┬──────────┐
│ id (UUID)  │ userId     │ bookId     │ borrowedAt            │ dueDate               │ returnedAt  │ status   │
├────────────┼────────────┼────────────┼───────────────────────┼───────────────────────┼─────────────┼──────────┤
│ br1        │ u1         │ b1         │ 2024-01-15T00:00:00Z  │ 2024-01-29T00:00:00Z  │ NULL        │ BORROWED │
│ br2        │ u1         │ b2         │ 2024-01-10T00:00:00Z  │ 2024-01-24T00:00:00Z  │ 2024-01-20Z │ RETURNED │
└────────────┴────────────┴────────────┴───────────────────────┴───────────────────────┴─────────────┴──────────┘

Book Table
┌────────────┬───────────────────────┬──────────────────┬──────────────┬──────────┐
│ id (UUID)  │ title                 │ author           │ isbn         │ quantity │
├────────────┼───────────────────────┼──────────────────┼──────────────┼──────────┤
│ b1         │ 1984                  │ George Orwell    │ 978-0451524  │ 5        │
│ b2         │ The Great Gatsby      │ F. S. Fitzgerald │ 978-0743273  │ 3        │
└────────────┴───────────────────────┴──────────────────┴──────────────┴──────────┘
```

### Relationships
- `User.id` ← `Borrowing.userId` (One user can have many borrowings)
- `Book.id` ← `Borrowing.bookId` (One book can be borrowed multiple times)

---

## 🔍 The Complete SQL Query

```sql
SELECT 
  u."name", 
  u."email", 
  u."createdAt",
  COALESCE(
    json_agg(
      json_build_object(
        'bookId', b."id",
        'title', b."title",
        'author', b."author",
        'borrowedAt', br."borrowedAt",
        'dueDate', br."dueDate",
        'returnedAt', br."returnedAt",
        'status', br."borrowingStatus"
      )
    ) FILTER (WHERE b."id" IS NOT NULL), 
    '[]'
  ) as "borrowedBooks"
FROM "User" u
LEFT JOIN "Borrowing" br ON u."id" = br."userId"
LEFT JOIN "Book" b ON br."bookId" = b."id"
WHERE u."name" ILIKE $1 OR u."email" ILIKE $1
GROUP BY u."id", u."name", u."email", u."createdAt"
ORDER BY u."name" ASC
LIMIT $2 OFFSET $3
```

---

## 📖 Step-by-Step Breakdown

### Step 1: Basic SELECT with Table Aliases

```sql
SELECT 
  u."name", 
  u."email", 
  u."createdAt"
FROM "User" u
```

**What it does:**
- Query the `User` table
- Alias it as `u` for shorter references
- Select basic user information

**Result so far:**
```
┌──────────┬────────────────┬───────────────────────┐
│ name     │ email          │ createdAt             │
├──────────┼────────────────┼───────────────────────┤
│ John Doe │ john@email.com │ 2024-01-01T00:00:00Z  │
│ Jane S.  │ jane@email.com │ 2024-01-02T00:00:00Z  │
└──────────┴────────────────┴───────────────────────┘
```

---

### Step 2: LEFT JOIN - Connecting Tables

```sql
FROM "User" u
LEFT JOIN "Borrowing" br ON u."id" = br."userId"
LEFT JOIN "Book" b ON br."bookId" = b."id"
```

#### Why LEFT JOIN instead of INNER JOIN?

| Join Type | What It Does | Result |
|-----------|--------------|--------|
| **LEFT JOIN** | Returns ALL rows from left table (User), even if no match in right table | ✅ All users included, even those with no borrowings |
| **INNER JOIN** | Returns ONLY rows that have matches in BOTH tables | ❌ Only users who borrowed books are included |

#### Visual Representation

```
User Table          Borrowing Table         Book Table
┌──────────┐        ┌──────────────┐        ┌─────────────────┐
│ id: u1   │───────▶│ userId: u1   │───────▶│ id: b1          │
│ name: Jo │        │ bookId: b1   │        │ title: 1984     │
└──────────┘        └──────────────┘        └─────────────────┘
                    ┌──────────────┐        ┌─────────────────┐
                    │ userId: u1   │───────▶│ id: b2          │
                    │ bookId: b2   │        │ title: Gatsby   │
                    └──────────────┘        └─────────────────┘

┌──────────┐
│ id: u2   │        (No borrowings)
│ name: Ja │
└──────────┘
```

#### After LEFT JOIN Results

```
┌──────────┬────────────────┬────────────┬────────────┬──────────────────────┐
│ User     │ Email          │ BorrowingID│ BookID     │ Book Title           │
├──────────┼────────────────┼────────────┼────────────┼──────────────────────┤
│ John Doe │ john@email.com │ br1        │ b1         │ 1984                 │
│ John Doe │ john@email.com │ br2        │ b2         │ The Great Gatsby     │
│ Jane S.  │ jane@email.com │ NULL       │ NULL       │ NULL                 │
└──────────┴────────────────┴────────────┴────────────┴──────────────────────┘
```

**Notice:**
- John appears **twice** (one row per borrowing)
- Jane still appears **once** with NULL values (no borrowings)

---

### Step 3: json_build_object() - Creating JSON Objects

```sql
json_build_object(
  'bookId', b."id",
  'title', b."title",
  'author', b."author",
  'borrowedAt', br."borrowedAt",
  'dueDate', br."dueDate",
  'returnedAt', br."returnedAt",
  'status', br."borrowingStatus"
)
```

**What it does:**
- Takes alternating key-value pairs
- Creates a JSON object from database columns

#### Example Transformation

**Database columns:**
```
b.id = "uuid-123"
b.title = "1984"
b.author = "George Orwell"
br.borrowedAt = "2024-01-15T00:00:00.000Z"
br.dueDate = "2024-01-29T00:00:00.000Z"
br.returnedAt = NULL
br.borrowingStatus = "BORROWED"
```

**Becomes JSON object:**
```json
{
  "bookId": "uuid-123",
  "title": "1984",
  "author": "George Orwell",
  "borrowedAt": "2024-01-15T00:00:00.000Z",
  "dueDate": "2024-01-29T00:00:00.000Z",
  "returnedAt": null,
  "status": "BORROWED"
}
```

---

### Step 4: json_agg() - Aggregating Into Array

```sql
json_agg(
  json_build_object(...)
)
```

**What it does:**
- Takes multiple JSON objects
- Combines them into a **JSON array**
- Groups all borrowings for the same user

#### Visual Example

**Before json_agg (3 separate rows for John):**
```
┌──────────┬────────────────────────────────────────────┐
│ User     │ Book Object                                │
├──────────┼────────────────────────────────────────────┤
│ John Doe │ {bookId: "b1", title: "1984", ...}        │
│ John Doe │ {bookId: "b2", title: "Gatsby", ...}      │
│ John Doe │ {bookId: "b3", title: "Mockingbird", ...} │
└──────────┴────────────────────────────────────────────┘
```

**After json_agg (1 row with array):**
```
┌──────────┬─────────────────────────────────────────────────────┐
│ User     │ borrowedBooks                                       │
├──────────┼─────────────────────────────────────────────────────┤
│ John Doe │ [                                                   │
│          │   {bookId: "b1", title: "1984", ...},              │
│          │   {bookId: "b2", title: "Gatsby", ...},            │
│          │   {bookId: "b3", title: "Mockingbird", ...}        │
│          │ ]                                                   │
└──────────┴─────────────────────────────────────────────────────┘
```

---

### Step 5: FILTER - Excluding NULL Results

```sql
json_agg(...) FILTER (WHERE b."id" IS NOT NULL)
```

**Why we need this:**
- LEFT JOIN creates rows with NULL when user has no borrowings
- We don't want NULL objects in our array
- FILTER clause excludes those NULL rows from aggregation

#### Example

**Without FILTER:**
```json
{
  "name": "Jane Smith",
  "borrowedBooks": [null]  // ❌ Bad! We don't want null in array
}
```

**With FILTER:**
```json
{
  "name": "Jane Smith",
  "borrowedBooks": null  // Will be handled by COALESCE next
}
```

---

### Step 6: COALESCE - Handling NULL Values

```sql
COALESCE(
  json_agg(...) FILTER (WHERE b."id" IS NOT NULL), 
  '[]'
)
```

**What COALESCE does:**
- Returns the **first non-NULL value** from its arguments
- If first argument is NULL → return second argument
- Think of it as: `value ?? defaultValue` in JavaScript

#### Example

**User WITH borrowings:**
```sql
json_agg() returns: [{"bookId": "b1", ...}, {"bookId": "b2", ...}]
COALESCE returns: [{"bookId": "b1", ...}, {"bookId": "b2", ...}]
                  ↑ Uses the array (not NULL)
```

**User WITHOUT borrowings:**
```sql
json_agg() returns: NULL
COALESCE returns: []
                  ↑ Uses empty array fallback
```

---

### Step 7: GROUP BY - Combining Rows Per User

```sql
GROUP BY u."id", u."name", u."email", u."createdAt"
```

**Why we need GROUP BY:**
- LEFT JOIN created **multiple rows per user** (one per borrowing)
- GROUP BY **combines** them back into **one row per user**
- Aggregate functions (like `json_agg`) work on the grouped rows

#### Visual Example

**Before GROUP BY (John has 3 rows):**
```
┌────────┬──────────┬────────────────┬──────────┐
│ UserID │ Name     │ Email          │ BookID   │
├────────┼──────────┼────────────────┼──────────┤
│ u1     │ John Doe │ john@email.com │ b1       │
│ u1     │ John Doe │ john@email.com │ b2       │
│ u1     │ John Doe │ john@email.com │ b3       │
│ u2     │ Jane S.  │ jane@email.com │ NULL     │
└────────┴──────────┴────────────────┴──────────┘
```

**After GROUP BY (John becomes 1 row):**
```
┌────────┬──────────┬────────────────┬──────────────────────┐
│ UserID │ Name     │ Email          │ borrowedBooks        │
├────────┼──────────┼────────────────┼──────────────────────┤
│ u1     │ John Doe │ john@email.com │ [b1, b2, b3]         │
│ u2     │ Jane S.  │ jane@email.com │ []                   │
└────────┴──────────┴────────────────┴──────────────────────┘
```

**Important Rule:**
- **All columns** in SELECT must be in GROUP BY
- **Except** aggregate functions (like `json_agg`, `COUNT`, `SUM`)

---

### Step 8: WHERE Clause - Filtering Users

```sql
WHERE u."name" ILIKE $1 OR u."email" ILIKE $1
```

**Components:**
- `ILIKE`: Case-**insensitive** pattern matching (PostgreSQL-specific)
- `$1`: Parameter placeholder (prevents SQL injection)
- `%search%`: Wildcard pattern (matches anywhere in string)

**Examples:**
```javascript
// JavaScript
params = ['%john%', limitNumber, offset]

// SQL will match:
"John Doe"     ✅ (contains "john")
"JOHN SMITH"   ✅ (case insensitive)
"johnny"       ✅ (contains "john")
"Jane"         ❌ (doesn't contain "john")
```

---

### Step 9: ORDER BY, LIMIT, OFFSET - Pagination

```sql
ORDER BY u."name" ASC
LIMIT $2 OFFSET $3
```

#### ORDER BY
- Sorts results alphabetically by name
- `ASC` = Ascending (A→Z)
- `DESC` = Descending (Z→A)

#### LIMIT
- Maximum number of results to return
- Example: `LIMIT 10` = return max 10 users

#### OFFSET
- Skip first N results
- Used for pagination

**Pagination Example:**
```javascript
// Page 1: Show first 10 users
LIMIT 10 OFFSET 0

// Page 2: Skip first 10, show next 10
LIMIT 10 OFFSET 10

// Page 3: Skip first 20, show next 10
LIMIT 10 OFFSET 20

// Formula: OFFSET = (page - 1) * limit
```

---

## 🎬 Complete Flow Example

Let's trace a **complete example** from start to finish.

### Sample Database Data

```
Users:
  - John Doe (id: u1, email: john@email.com)
  - Jane Smith (id: u2, email: jane@email.com)

Borrowings:
  - John borrowed book b1 on 2024-01-15
  - John borrowed book b2 on 2024-01-10 (returned on 2024-01-20)

Books:
  - b1: "1984" by George Orwell
  - b2: "The Great Gatsby" by F. Scott Fitzgerald
```

### Step-by-Step Execution

#### 1. FROM + LEFT JOIN

```sql
FROM "User" u
LEFT JOIN "Borrowing" br ON u."id" = br."userId"
LEFT JOIN "Book" b ON br."bookId" = b."id"
```

**Result:**
```
┌──────────┬────────────────┬────────────┬──────────────────────┬───────────────────────┬──────────────┐
│ Name     │ Email          │ BookID     │ Title                │ BorrowedAt            │ ReturnedAt   │
├──────────┼────────────────┼────────────┼──────────────────────┼───────────────────────┼──────────────┤
│ John Doe │ john@email.com │ b1         │ 1984                 │ 2024-01-15T00:00:00Z  │ NULL         │
│ John Doe │ john@email.com │ b2         │ The Great Gatsby     │ 2024-01-10T00:00:00Z  │ 2024-01-20Z  │
│ Jane S.  │ jane@email.com │ NULL       │ NULL                 │ NULL                  │ NULL         │
└──────────┴────────────────┴────────────┴──────────────────────┴───────────────────────┴──────────────┘
```

#### 2. json_build_object() - Create JSON for Each Row

```
┌──────────┬────────────────────────────────────────────────────────────┐
│ Name     │ Book Object                                                │
├──────────┼────────────────────────────────────────────────────────────┤
│ John Doe │ {bookId: "b1", title: "1984", borrowedAt: "2024-01-15"}   │
│ John Doe │ {bookId: "b2", title: "Gatsby", borrowedAt: "2024-01-10"} │
│ Jane S.  │ NULL (will be filtered out)                                │
└──────────┴────────────────────────────────────────────────────────────┘
```

#### 3. FILTER - Remove NULL Objects

```
┌──────────┬────────────────────────────────────────────────────────────┐
│ Name     │ Book Object                                                │
├──────────┼────────────────────────────────────────────────────────────┤
│ John Doe │ {bookId: "b1", title: "1984", borrowedAt: "2024-01-15"}   │
│ John Doe │ {bookId: "b2", title: "Gatsby", borrowedAt: "2024-01-10"} │
│ Jane S.  │ (no objects - filtered out)                                │
└──────────┴────────────────────────────────────────────────────────────┘
```

#### 4. json_agg() + GROUP BY - Combine Into Array

```
┌──────────┬────────────────────────────────────────────────────────────────┐
│ Name     │ borrowedBooks                                                  │
├──────────┼────────────────────────────────────────────────────────────────┤
│ John Doe │ [                                                              │
│          │   {bookId: "b1", title: "1984", borrowedAt: "2024-01-15"},    │
│          │   {bookId: "b2", title: "Gatsby", borrowedAt: "2024-01-10"}   │
│          │ ]                                                              │
│ Jane S.  │ NULL (will be converted to [] by COALESCE)                     │
└──────────┴────────────────────────────────────────────────────────────────┘
```

#### 5. COALESCE - Convert NULL to Empty Array

```
┌──────────┬────────────────────────────────────────────────────────────────┐
│ Name     │ borrowedBooks                                                  │
├──────────┼────────────────────────────────────────────────────────────────┤
│ John Doe │ [                                                              │
│          │   {bookId: "b1", title: "1984", borrowedAt: "2024-01-15"},    │
│          │   {bookId: "b2", title: "Gatsby", borrowedAt: "2024-01-10"}   │
│          │ ]                                                              │
│ Jane S.  │ []  ← Converted from NULL                                      │
└──────────┴────────────────────────────────────────────────────────────────┘
```

### Final JSON Response

```json
{
  "status": "success",
  "message": "User Found",
  "data": {
    "users": [
      {
        "name": "John Doe",
        "email": "john@email.com",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "borrowedBooks": [
          {
            "bookId": "b1",
            "title": "1984",
            "author": "George Orwell",
            "borrowedAt": "2024-01-15T00:00:00.000Z",
            "dueDate": "2024-01-29T00:00:00.000Z",
            "returnedAt": null,
            "status": "BORROWED"
          },
          {
            "bookId": "b2",
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "borrowedAt": "2024-01-10T00:00:00.000Z",
            "dueDate": "2024-01-24T00:00:00.000Z",
            "returnedAt": "2024-01-20T00:00:00.000Z",
            "status": "RETURNED"
          }
        ]
      },
      {
        "name": "Jane Smith",
        "email": "jane@email.com",
        "createdAt": "2024-01-02T00:00:00.000Z",
        "borrowedBooks": []
      }
    ]
  },
  "pagination": {
    "currentPage": 1,
    "itemsPerPage": 10,
    "totalItems": 2,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

---

## 🎯 INNER JOIN vs LEFT JOIN - Complete Guide

### Understanding the Fundamental Difference

The choice between INNER JOIN and LEFT JOIN is one of the most important decisions in SQL queries. Let's understand them deeply.

---

### Visual Comparison

#### Sample Data
```
User Table                    Borrowing Table
┌────────────────┐           ┌──────────────────┐
│ id  │ name     │           │ userId │ bookId │
├─────┼──────────┤           ├────────┼────────┤
│ u1  │ John     │───────┐   │ u1     │ b1     │
│ u2  │ Jane     │       └──▶│ u1     │ b2     │
│ u3  │ Bob      │           └────────┴────────┘
└─────┴──────────┘           (Bob has no borrowings)
```

#### INNER JOIN Result
```sql
SELECT u.name, br.bookId
FROM User u
INNER JOIN Borrowing br ON u.id = br.userId
```

**Result:**
```
┌──────┬────────┐
│ name │ bookId │
├──────┼────────┤
│ John │ b1     │
│ John │ b2     │
└──────┴────────┘
```
❌ **Bob is NOT included** (he has no borrowings)

#### LEFT JOIN Result
```sql
SELECT u.name, br.bookId
FROM User u
LEFT JOIN Borrowing br ON u.id = br.userId
```

**Result:**
```
┌──────┬────────┐
│ name │ bookId │
├──────┼────────┤
│ John │ b1     │
│ John │ b2     │
│ Bob  │ NULL   │  ← Bob is included!
└──────┴────────┘
```
✅ **Bob IS included** (with NULL for bookId)

---

### Detailed Explanation

#### INNER JOIN

**Definition:**
- Returns **ONLY** rows that have matching values in **BOTH** tables
- If no match → row is excluded from result
- Think: "**intersection**" of two tables

**Visual Representation:**
```
     Table A          Table B
   ┌─────────┐      ┌─────────┐
   │    ╔════╪══════╪════╗    │
   │    ║ INNER JOIN ║    │
   │    ╚════╪══════╪════╝    │
   └─────────┘      └─────────┘
   
Only the overlapping part is returned
```

**When to Use:**
✅ When you **ONLY want rows with matches**
✅ When the relationship is **required/mandatory**
✅ When you want to **exclude unmatched rows**

**Example Use Cases:**

1. **Get users who have actually borrowed books**
```sql
SELECT u.name, b.title
FROM User u
INNER JOIN Borrowing br ON u.id = br.userId
INNER JOIN Book b ON br.bookId = b.id
```
- Only returns users who borrowed books
- Users with no borrowings are excluded

2. **Get books that are currently borrowed**
```sql
SELECT b.title, u.name as borrower
FROM Book b
INNER JOIN Borrowing br ON b.id = br.bookId
INNER JOIN User u ON br.userId = u.id
WHERE br.returnedAt IS NULL
```
- Only returns books that are actually borrowed
- Available books are excluded

3. **Find users and their active subscriptions**
```sql
SELECT u.name, s.planName
FROM User u
INNER JOIN Subscription s ON u.id = s.userId
WHERE s.status = 'active'
```
- Only users with active subscriptions
- Users without subscriptions are excluded

---

#### LEFT JOIN (LEFT OUTER JOIN)

**Definition:**
- Returns **ALL** rows from the **left table**
- Plus matching rows from the right table
- If no match → right table columns are NULL
- Think: "**everything from left, plus matches from right**"

**Visual Representation:**
```
     Table A          Table B
   ┌─────────┐      ┌─────────┐
   │ ╔═══════╪══════╪═══╗     │
   │ ║   LEFT JOIN   ║     │
   │ ╚═══════╪══════╪═══╝     │
   └─────────┘      └─────────┘
   
All of left table + matching parts of right
```

**When to Use:**
✅ When you want **ALL rows from the main table**
✅ When the relationship is **optional**
✅ When you want to **include unmatched rows**

**Example Use Cases:**

1. **Get ALL users with their borrowing history (including users who never borrowed)**
```sql
SELECT u.name, COUNT(br.id) as borrowingCount
FROM User u
LEFT JOIN Borrowing br ON u.id = br.userId
GROUP BY u.id, u.name
```
- Returns all users
- Users with no borrowings show count = 0

2. **Get ALL books with borrowing status**
```sql
SELECT 
  b.title, 
  CASE 
    WHEN br.id IS NULL THEN 'Available'
    ELSE 'Borrowed'
  END as status
FROM Book b
LEFT JOIN Borrowing br ON b.id = br.bookId AND br.returnedAt IS NULL
```
- Shows all books
- Available books have NULL for borrowing info

3. **User list with optional profile pictures**
```sql
SELECT u.name, u.email, p.photoUrl
FROM User u
LEFT JOIN Profile p ON u.id = p.userId
```
- All users are shown
- Users without profiles have NULL for photoUrl

---

### Decision Tree: Which JOIN Should I Use?

```
START
  │
  ├─ Do I need ALL rows from the main table?
  │   │
  │   ├─ YES ──→ Use LEFT JOIN
  │   │           (Main table = left table)
  │   │
  │   └─ NO ──→ Continue...
  │
  ├─ Should rows WITHOUT a match be excluded?
  │   │
  │   ├─ YES ──→ Use INNER JOIN
  │   │
  │   └─ NO ──→ Use LEFT JOIN
  │
  └─ Is the relationship required/mandatory?
      │
      ├─ YES ──→ Use INNER JOIN
      │
      └─ NO (optional) ──→ Use LEFT JOIN
```

---

### Real-World Examples from Our Codebase

#### Example 1: Get All Users with Borrowing History

**Requirement:** Show ALL library members, including those who haven't borrowed any books yet.

```sql
-- ✅ CORRECT: Use LEFT JOIN
SELECT 
  u.name, 
  u.email,
  COALESCE(json_agg(b.title), '[]') as borrowedBooks
FROM User u
LEFT JOIN Borrowing br ON u.id = br.userId
LEFT JOIN Book b ON br.bookId = b.id
GROUP BY u.id, u.name, u.email
```

**Why LEFT JOIN?**
- We want ALL users (main requirement)
- Borrowing is optional (not all users have borrowed)
- Users without borrowings should appear with empty array

**Result:**
```json
[
  {"name": "John", "borrowedBooks": ["1984", "Gatsby"]},
  {"name": "Jane", "borrowedBooks": ["Mockingbird"]},
  {"name": "Bob", "borrowedBooks": []}  ← Bob included even with no borrowings
]
```

**❌ If we used INNER JOIN:**
```json
[
  {"name": "John", "borrowedBooks": ["1984", "Gatsby"]},
  {"name": "Jane", "borrowedBooks": ["Mockingbird"]}
  // Bob would be missing!
]
```

---

#### Example 2: Get Books Currently Borrowed by a User

**Requirement:** Show ONLY the books that a specific user is currently borrowing.

```sql
-- ✅ CORRECT: Use INNER JOIN
SELECT 
  b.id,
  b.title,
  b.author,
  br.borrowedAt,
  br.dueDate
FROM Book b
INNER JOIN Borrowing br ON b.id = br.bookId
WHERE br.userId = $1 AND br.returnedAt IS NULL
```

**Why INNER JOIN?**
- We ONLY want books that are borrowed (not all books)
- The borrowing relationship is required for this query
- Books not borrowed by this user should be excluded

**Result:**
```json
[
  {"title": "1984", "borrowedAt": "2024-01-15", "dueDate": "2024-01-29"},
  {"title": "Gatsby", "borrowedAt": "2024-01-10", "dueDate": "2024-01-24"}
]
```

**❌ If we used LEFT JOIN:**
```json
[
  {"title": "1984", "borrowedAt": "2024-01-15", "dueDate": "2024-01-29"},
  {"title": "Gatsby", "borrowedAt": "2024-01-10", "dueDate": "2024-01-24"},
  {"title": "War and Peace", "borrowedAt": null, "dueDate": null},  ← Not borrowed
  {"title": "Moby Dick", "borrowedAt": null, "dueDate": null},      ← Not borrowed
  // Would return ALL books, not what we want!
]
```

---

#### Example 3: Available Books (Not Currently Borrowed)

**Requirement:** Show books that are available (not borrowed or returned).

**Option A: Use LEFT JOIN to find NULL**
```sql
SELECT b.title, b.quantity
FROM Book b
LEFT JOIN Borrowing br ON b.id = br.bookId AND br.returnedAt IS NULL
WHERE br.id IS NULL  -- No active borrowing
```

**Option B: Use NOT IN subquery**
```sql
SELECT b.title, b.quantity
FROM Book b
WHERE b.id NOT IN (
  SELECT bookId FROM Borrowing WHERE returnedAt IS NULL
)
```

**Both work!** Use LEFT JOIN for better performance on large datasets.

---

### Common Mistakes and How to Avoid Them

#### Mistake 1: Using INNER JOIN when you want all rows

**❌ Wrong:**
```sql
-- Want: All users with borrowing count
SELECT u.name, COUNT(br.id) as count
FROM User u
INNER JOIN Borrowing br ON u.id = br.userId
GROUP BY u.id, u.name
```
**Problem:** Users with no borrowings are excluded entirely!

**✅ Correct:**
```sql
SELECT u.name, COUNT(br.id) as count
FROM User u
LEFT JOIN Borrowing br ON u.id = br.userId
GROUP BY u.id, u.name
```

---

#### Mistake 2: Using LEFT JOIN then filtering out NULLs in WHERE

**❌ Wrong:**
```sql
SELECT u.name, br.bookId
FROM User u
LEFT JOIN Borrowing br ON u.id = br.userId
WHERE br.bookId IS NOT NULL  -- This defeats the purpose!
```
**Problem:** LEFT JOIN says "keep all users", but WHERE removes users without borrowings. Just use INNER JOIN!

**✅ Correct:**
```sql
SELECT u.name, br.bookId
FROM User u
INNER JOIN Borrowing br ON u.id = br.userId
```

**💡 Tip:** Filter NULLs in the **ON clause** if you want to keep LEFT JOIN behavior:
```sql
SELECT u.name, br.bookId
FROM User u
LEFT JOIN Borrowing br ON u.id = br.userId AND br.returnedAt IS NULL
-- This keeps all users, but only joins active borrowings
```

---

#### Mistake 3: Wrong table order with LEFT JOIN

**❌ Wrong:**
```sql
-- Want: All users with their borrowings
SELECT br.bookId, u.name
FROM Borrowing br  -- Wrong! This is the left table now
LEFT JOIN User u ON br.userId = u.id
```
**Problem:** Returns all borrowings, not all users!

**✅ Correct:**
```sql
SELECT u.name, br.bookId
FROM User u  -- User should be the left table
LEFT JOIN Borrowing br ON u.id = br.userId
```

---

### Performance Considerations

#### INNER JOIN Performance
- ✅ **Faster** when both tables are large and you only need matches
- ✅ Can stop searching once no matches found
- ✅ Smaller result set

#### LEFT JOIN Performance
- ⚠️ **Slower** on large tables (must scan entire left table)
- ⚠️ Larger result set (includes unmatched rows)
- ✅ But necessary when you need all left table rows!

**Optimization Tip:**
```sql
-- Add indexes on JOIN columns
CREATE INDEX idx_borrowing_userId ON Borrowing(userId);
CREATE INDEX idx_borrowing_bookId ON Borrowing(bookId);
```

---

### Quick Reference Table

| Scenario | Use This | Example |
|----------|----------|---------|
| **All users, even those without borrowings** | LEFT JOIN | Member list with borrowing history |
| **Only users who borrowed books** | INNER JOIN | Active borrowers report |
| **All books with optional borrowing info** | LEFT JOIN | Library catalog with availability |
| **Only borrowed books** | INNER JOIN | Currently borrowed books list |
| **Users with at least one purchase** | INNER JOIN | Customer order history |
| **All products with optional reviews** | LEFT JOIN | Product catalog with ratings |
| **Orders with their items** | INNER JOIN | Order details (items required) |
| **Employees with optional managers** | LEFT JOIN | Org chart (CEO has no manager) |

---

### Practice Questions

Test your understanding:

**Q1:** You want to list all books in the library. Some books have reviews, some don't. You want to show all books with their average rating (or NULL if no reviews).

<details>
<summary>Answer</summary>

```sql
SELECT 
  b.title, 
  AVG(r.rating) as avgRating
FROM Book b
LEFT JOIN Review r ON b.id = r.bookId
GROUP BY b.id, b.title
```
Use **LEFT JOIN** because you want ALL books.
</details>

**Q2:** You want to see which users have overdue books. Only show users with actually overdue books.

<details>
<summary>Answer</summary>

```sql
SELECT 
  u.name, 
  b.title,
  br.dueDate
FROM User u
INNER JOIN Borrowing br ON u.id = br.userId
INNER JOIN Book b ON br.bookId = b.id
WHERE br.returnedAt IS NULL 
  AND br.dueDate < CURRENT_DATE
```
Use **INNER JOIN** because you only want users who have overdue books.
</details>

**Q3:** Show all library members and count how many books each has borrowed (including members who borrowed 0 books).

<details>
<summary>Answer</summary>

```sql
SELECT 
  u.name, 
  COUNT(br.id) as borrowedCount
FROM User u
LEFT JOIN Borrowing br ON u.id = br.userId
GROUP BY u.id, u.name
```
Use **LEFT JOIN** to include all members, even those with 0 borrowings.
</details>

---

## 🎯 Key Concepts Summary

### 1. LEFT JOIN vs INNER JOIN

| Feature | LEFT JOIN | INNER JOIN |
|---------|-----------|------------|
| **Includes all left table rows** | ✅ Yes | ❌ No |
| **Shows users without borrowings** | ✅ Yes (with NULL) | ❌ No |
| **Best for optional relationships** | ✅ Yes | ❌ No |
| **Best for required relationships** | ❌ No | ✅ Yes |
| **Performance on large tables** | Slower | Faster |
| **Result set size** | Larger | Smaller |

### 2. JSON Functions

| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `json_build_object()` | Create JSON object | Key-value pairs | `{key: value}` |
| `json_agg()` | Aggregate into array | Multiple objects | `[obj1, obj2]` |

### 3. Aggregate Functions

- **json_agg()**: Combines multiple rows into JSON array
- **COUNT()**: Counts number of rows
- **SUM()**: Adds up numeric values
- **All require GROUP BY** for non-aggregated columns

### 4. PostgreSQL-Specific Features

| Feature | Description |
|---------|-------------|
| `FILTER (WHERE ...)` | Filter rows before aggregation |
| `ILIKE` | Case-insensitive pattern matching |
| `COALESCE(val1, val2)` | Return first non-NULL value |

---

## 💡 Common Patterns

### Pattern 1: Count of Borrowings (Instead of Full List)

```sql
SELECT 
  u."name", 
  u."email", 
  COUNT(br."id") as "borrowingsCount"
FROM "User" u
LEFT JOIN "Borrowing" br ON u."id" = br."userId"
GROUP BY u."id", u."name", u."email"
```

### Pattern 2: Only Active Borrowings

```sql
COALESCE(
  json_agg(...)
  FILTER (WHERE br."returnedAt" IS NULL),  -- Only not-returned books
  '[]'
) as "activeBorrowings"
```

### Pattern 3: Nested Aggregations

```sql
SELECT 
  u."name",
  json_build_object(
    'borrowed', COUNT(br."id") FILTER (WHERE br."returnedAt" IS NULL),
    'returned', COUNT(br."id") FILTER (WHERE br."returnedAt" IS NOT NULL)
  ) as "statistics"
FROM "User" u
LEFT JOIN "Borrowing" br ON u."id" = br."userId"
GROUP BY u."id", u."name"
```

---

## 🚀 Performance Considerations

### Indexes for Better Performance

```sql
-- Index on foreign keys
CREATE INDEX idx_borrowing_userId ON "Borrowing"("userId");
CREATE INDEX idx_borrowing_bookId ON "Borrowing"("bookId");

-- Composite index for common queries
CREATE INDEX idx_user_name_email ON "User"("name", "email");
```

### When to Use This Pattern

✅ **Good for:**
- Small to medium datasets (< 100K users)
- When you need complete borrowing history
- API responses with nested data

❌ **Not recommended for:**
- Users with thousands of borrowings (array becomes too large)
- Real-time high-traffic endpoints (consider caching)
- Very large datasets (consider pagination at borrowing level)

---

## 📚 Additional Resources

- [PostgreSQL JSON Functions](https://www.postgresql.org/docs/current/functions-json.html)
- [PostgreSQL Aggregate Functions](https://www.postgresql.org/docs/current/functions-aggregate.html)
- [PostgreSQL JOIN Types](https://www.postgresql.org/docs/current/tutorial-join.html)

---

## 🤝 Contributing

Feel free to suggest improvements or corrections to this documentation!

---

**Last Updated:** December 2024

