# Complete Unit Testing Guide for Beginners

> A comprehensive guide to understanding and writing unit tests in JavaScript with Jest

---

## Table of Contents

1. [What is Unit Testing?](#what-is-unit-testing)
2. [Why Write Tests?](#why-write-tests)
3. [Testing Terminology](#testing-terminology)
4. [Understanding Jest](#understanding-jest)
5. [The AAA Pattern](#the-aaa-pattern)
6. [Mocking Explained](#mocking-explained)
7. [Writing Your First Test](#writing-your-first-test)
8. [Real Examples from Your Project](#real-examples-from-your-project)
9. [Common Test Patterns](#common-test-patterns)
10. [Best Practices](#best-practices)
11. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
12. [Running and Debugging Tests](#running-and-debugging-tests)

---

## What is Unit Testing?

### Definition

**Unit testing** is the practice of writing automated tests that verify individual "units" of code work correctly in isolation.

A **unit** is the smallest testable part of your application:
- A function
- A method
- A class
- A module

### Simple Analogy

Think of building a car:
- 🔧 **Unit Test** = Testing each part individually (engine, brakes, steering wheel)
- 🚗 **Integration Test** = Testing how parts work together (engine + transmission)
- 🛣️ **End-to-End Test** = Test driving the whole car on the road

### Example

```javascript
// This is a "unit" - a single function
function addNumbers(a, b) {
  return a + b;
}

// This is a "unit test" - testing that single function
test('addNumbers should add two numbers', () => {
  const result = addNumbers(2, 3);
  expect(result).toBe(5);
});
```

---

## Why Write Tests?

### 1. **Catch Bugs Early** 🐛
Without tests:
```
Code → Deploy → User finds bug → Emergency fix → Deploy again
```

With tests:
```
Code → Test fails → Fix bug → Test passes → Deploy confidently
```

### 2. **Documentation** 📚
Tests show how your code is supposed to work:

```javascript
it('should reject login with invalid password', async () => {
  // This test tells developers: "The system should reject wrong passwords"
});
```

### 3. **Confidence to Refactor** 🔧
You can change code without fear:
- Tests will tell you if you broke something
- Safe to improve and optimize code

### 4. **Save Time** ⏰
- Manual testing: Click through app 100 times
- Automated testing: Run 100 tests in 2 seconds

### 5. **Better Code Design** 🏗️
If code is hard to test, it's probably poorly designed. Testing forces you to write better code.

---

## Testing Terminology

### Core Concepts

| Term | Definition | Example |
|------|------------|---------|
| **Test Suite** | A group of related tests | All tests for `authController` |
| **Test Case** | A single test scenario | "should login with valid credentials" |
| **Assertion** | Checking if something is true | `expect(result).toBe(5)` |
| **Mock** | Fake version of something | Fake database that doesn't actually connect |
| **Spy** | Watches a function to see if/how it was called | Check if `res.json()` was called |
| **Coverage** | Percentage of code tested | 80% of lines have tests |

### Test States

- ✅ **Passing** - Test succeeded (code works as expected)
- ❌ **Failing** - Test failed (code has a bug or test is wrong)
- ⏭️ **Skipped** - Test was not run (using `test.skip()`)
- ⏸️ **Pending** - Test is incomplete (using `test.todo()`)

---

## Understanding Jest

### What is Jest?

**Jest** is a JavaScript testing framework created by Facebook. It provides:
- Test runner (runs your tests)
- Assertion library (the `expect()` functions)
- Mocking capabilities (fake functions and modules)
- Coverage reports (shows what's tested)

### Basic Jest Syntax

```javascript
// Import Jest functions
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

// describe() groups related tests
describe('Calculator', () => {
  
  // it() or test() defines a single test
  it('should add two numbers', () => {
    // expect() makes an assertion
    expect(2 + 2).toBe(4);
  });
  
  test('should subtract two numbers', () => {
    expect(5 - 3).toBe(2);
  });
});
```

### Jest Matchers (Assertions)

```javascript
// Exact equality
expect(value).toBe(5);              // Same value and type
expect(object).toEqual({ a: 1 });   // Deep equality for objects

// Truthiness
expect(value).toBeTruthy();         // True, 1, "string", etc.
expect(value).toBeFalsy();          // False, 0, "", null, undefined
expect(value).toBeNull();           // Exactly null
expect(value).toBeUndefined();      // Exactly undefined
expect(value).toBeDefined();        // Not undefined

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(0.3);     // For floating point

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(object).toHaveProperty('key');
expect(object).toMatchObject({ a: 1 });

// Functions
expect(fn).toThrow();
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledWith(arg1, arg2);
```

---

## The AAA Pattern

Every good test follows the **AAA pattern**:

### 1. **Arrange** - Set up the test
Prepare everything needed for the test:
- Create test data
- Set up mocks
- Initialize objects

### 2. **Act** - Execute the code
Call the function or method you're testing.

### 3. **Assert** - Verify the results
Check that the output is what you expected.

### Example

```javascript
it('should add a new book', async () => {
  // ========== ARRANGE ==========
  // Prepare the test data
  const mockReq = {
    body: {
      title: 'Test Book',
      author: 'Test Author',
      isbn: '1234567890',
      quantity: 5
    }
  };
  
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  
  // Set up mock database responses
  db.oneOrNone.mockResolvedValue(null);  // ISBN doesn't exist
  db.one.mockResolvedValue({
    id: 1,
    title: 'Test Book',
    author: 'Test Author',
    isbn: '1234567890',
    quantity: 5
  });
  
  // ========== ACT ==========
  // Call the function we're testing
  await addBook(mockReq, mockRes);
  
  // ========== ASSERT ==========
  // Verify the results
  expect(mockRes.status).toHaveBeenCalledWith(201);
  expect(mockRes.json).toHaveBeenCalledWith(
    expect.objectContaining({
      status: 'success',
      message: 'Book added successfully'
    })
  );
});
```

---

## Mocking Explained

### What is Mocking?

**Mocking** means creating fake versions of things so you can test in isolation.

### Why Mock?

Without mocking:
```javascript
// This test would:
// 1. Connect to REAL database
// 2. Make REAL database queries
// 3. Modify REAL data
// 4. Be SLOW
// 5. Fail if database is down

test('should add book', async () => {
  await addBook(req, res);  // Touches real database!
});
```

With mocking:
```javascript
// This test:
// 1. Uses FAKE database
// 2. Runs FAST
// 3. Always WORKS
// 4. Doesn't affect real data

jest.mock('../../config/database.js', () => ({
  db: { one: jest.fn() }  // Fake database
}));

test('should add book', async () => {
  db.one.mockResolvedValue({ id: 1 });  // Control what it returns
  await addBook(req, res);
});
```

### What to Mock

✅ **Always mock:**
- Databases
- External APIs
- File system
- Network calls
- Current date/time
- Random number generators

❌ **Don't mock:**
- The code you're testing
- Simple utilities
- Constants

### Types of Mocks

#### 1. Mock Functions

```javascript
// Create a mock function
const mockFunction = jest.fn();

// Control what it returns
mockFunction.mockReturnValue(42);
mockFunction.mockResolvedValue({ id: 1 });  // For async

// Check if it was called
expect(mockFunction).toHaveBeenCalled();
expect(mockFunction).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFunction).toHaveBeenCalledTimes(2);
```

#### 2. Mock Objects

```javascript
// Mock Express request/response
const mockReq = {
  body: { email: 'test@example.com' },
  params: { id: '1' },
  query: { page: '1' },
  user: { id: 123 }
};

const mockRes = {
  status: jest.fn().mockReturnThis(),  // Allows chaining
  json: jest.fn(),
  cookie: jest.fn()
};
```

#### 3. Mock Modules

```javascript
// Mock an entire module
jest.unstable_mockModule('../../config/database.js', () => ({
  db: {
    oneOrNone: jest.fn(),
    one: jest.fn(),
    many: jest.fn()
  }
}));

// Now when code imports database.js, it gets our mock
const { db } = await import('../../config/database.js');
```

---

## Writing Your First Test

Let's write a test from scratch!

### Step 1: Create a Simple Function

```javascript
// src/utils/math.js
export function multiply(a, b) {
  return a * b;
}
```

### Step 2: Create a Test File

```javascript
// src/__test__/utils/math.test.js
import { describe, it, expect } from '@jest/globals';
import { multiply } from '../../utils/math.js';

describe('multiply function', () => {
  it('should multiply two positive numbers', () => {
    // Arrange
    const a = 3;
    const b = 4;
    
    // Act
    const result = multiply(a, b);
    
    // Assert
    expect(result).toBe(12);
  });
  
  it('should handle negative numbers', () => {
    expect(multiply(-2, 3)).toBe(-6);
  });
  
  it('should handle zero', () => {
    expect(multiply(5, 0)).toBe(0);
  });
});
```

### Step 3: Run the Test

```bash
npm test
```

---

## Real Examples from Your Project

### Example 1: Testing a Utility Function

**File:** `src/utils/generateToken.js`

```javascript
export const generateToken = (userId, res) => {
  const payload = { id: userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
  });
  
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 7 * (24 * 60 * 60 * 1000)
  });
  
  return token;
};
```

**Test:** `src/__test__/utils/generateToken.test.js`

```javascript
describe('generateToken Utility', () => {
  let mockRes;

  beforeEach(() => {
    // Arrange - Set up before each test
    mockRes = {
      cookie: jest.fn()
    };
    process.env.JWT_SECRET = 'test-secret';
  });

  it('should generate a valid JWT token', () => {
    // Arrange
    const userId = 123;
    
    // Act
    const token = generateToken(userId, mockRes);
    
    // Assert
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
    
    // Verify token can be decoded
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe(userId);
  });

  it('should set HTTP-only cookie with correct options', () => {
    // Arrange
    const userId = 456;
    
    // Act
    generateToken(userId, mockRes);
    
    // Assert
    expect(mockRes.cookie).toHaveBeenCalledWith(
      'jwt',
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
    );
  });
});
```

**What This Test Does:**
1. ✅ Verifies token is created
2. ✅ Verifies token can be decoded
3. ✅ Verifies correct user ID is in token
4. ✅ Verifies cookie is set with correct options

---

### Example 2: Testing Middleware

**File:** `src/middleware/authMiddleware.js`

```javascript
const authMiddleware = async (req, res, next) => {
  let token;
  
  if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.oneOrNone('SELECT * FROM "User" WHERE "id" = $1', [decoded.id]);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not Authorized, Invalid Token' });
  }
};
```

**Test:** `src/__test__/middleware/authMiddleware.test.js`

```javascript
// Mock database before importing
const mockDb = { oneOrNone: jest.fn() };
jest.unstable_mockModule('../../config/database.js', () => ({
  db: mockDb
}));

const { default: authMiddleware } = await import('../../middleware/authMiddleware.js');

describe('Auth Middleware', () => {
  let mockReq, mockRes, mockNext;
  const testSecret = 'test-secret';

  beforeEach(() => {
    process.env.JWT_SECRET = testSecret;
    
    mockReq = {
      cookies: {},
      headers: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should authenticate user with valid cookie token', async () => {
    // Arrange
    const userId = 123;
    const token = jwt.sign({ id: userId }, testSecret);
    const mockUser = { 
      id: userId, 
      name: 'Test User', 
      email: 'test@example.com' 
    };

    mockReq.cookies.jwt = token;
    mockDb.oneOrNone.mockResolvedValue(mockUser);

    // Act
    await authMiddleware(mockReq, mockRes, mockNext);

    // Assert
    expect(mockDb.oneOrNone).toHaveBeenCalledWith(
      'SELECT * FROM "User" WHERE "id" = $1',
      [userId]
    );
    expect(mockReq.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should reject request without token', async () => {
    // Act
    await authMiddleware(mockReq, mockRes, mockNext);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
```

**What This Test Does:**
1. ✅ Tests successful authentication
2. ✅ Tests rejection without token
3. ✅ Mocks database to avoid real connections
4. ✅ Verifies correct functions are called

---

### Example 3: Testing a Controller

**File:** `src/controller/authController.js` (simplified)

```javascript
const login = async (req, res) => {
  const { email, password } = req.body;
  
  const user = await db.oneOrNone('SELECT * FROM "User" WHERE "email" = $1', [email]);
  
  if (!user) {
    return res.status(401).json({
      status: 'error',
      message: "Invalid Email and Password"
    });
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return res.status(400).json({
      status: 'error',
      message: "Invalid Password and Email"
    });
  }
  
  const token = generateToken(user.id, res);
  
  return res.status(201).json({
    status: 'success',
    message: 'Logged in successfully',
    data: { user: { id: user.id, email: user.email }, token }
  });
};
```

**Test:** `src/__test__/controller/authController.test.js`

```javascript
describe('login', () => {
  it('should login user with valid credentials', async () => {
    // Arrange
    mockReq.body = {
      email: 'john@example.com',
      password: 'password123'
    };

    const hashedPassword = await bcrypt.hash('password123', 10);
    const mockUser = {
      id: 1,
      email: 'john@example.com',
      password: hashedPassword
    };

    db.oneOrNone.mockResolvedValue(mockUser);
    generateToken.mockReturnValue('login-token');

    // Act
    await login(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'success',
        message: 'Logged in successfully',
        data: expect.objectContaining({
          token: 'login-token'
        })
      })
    );
  });

  it('should reject login with invalid email', async () => {
    // Arrange
    mockReq.body = {
      email: 'nonexistent@example.com',
      password: 'password123'
    };
    db.oneOrNone.mockResolvedValue(null);

    // Act
    await login(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Invalid Email and Password'
    });
  });

  it('should reject login with invalid password', async () => {
    // Arrange
    mockReq.body = {
      email: 'john@example.com',
      password: 'wrongpassword'
    };

    const hashedPassword = await bcrypt.hash('correctpassword', 10);
    const mockUser = {
      id: 1,
      email: 'john@example.com',
      password: hashedPassword
    };

    db.oneOrNone.mockResolvedValue(mockUser);

    // Act
    await login(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});
```

**What This Test Does:**
1. ✅ Tests successful login (happy path)
2. ✅ Tests invalid email error
3. ✅ Tests invalid password error
4. ✅ Mocks database and bcrypt
5. ✅ Verifies correct responses

---

## Common Test Patterns

### Pattern 1: Testing Async Functions

```javascript
// Use async/await
it('should fetch data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// Or return a promise
it('should fetch data', () => {
  return fetchData().then(data => {
    expect(data).toBeDefined();
  });
});
```

### Pattern 2: Testing Error Cases

```javascript
it('should throw error for invalid input', () => {
  expect(() => {
    validateInput('invalid');
  }).toThrow('Invalid input');
});

// For async errors
it('should reject promise for invalid input', async () => {
  await expect(asyncValidate('invalid')).rejects.toThrow('Invalid input');
});
```

### Pattern 3: Testing Multiple Cases (Table-Driven Tests)

```javascript
describe('calculate tax', () => {
  test.each([
    [100, 10, 110],
    [200, 10, 220],
    [50, 10, 55]
  ])('calculate(%i, %i) should return %i', (amount, rate, expected) => {
    expect(calculateTax(amount, rate)).toBe(expected);
  });
});
```

### Pattern 4: Setup and Teardown

```javascript
describe('Database tests', () => {
  // Runs once before all tests
  beforeAll(() => {
    connectDatabase();
  });

  // Runs before each test
  beforeEach(() => {
    clearDatabase();
  });

  // Runs after each test
  afterEach(() => {
    cleanupTestData();
  });

  // Runs once after all tests
  afterAll(() => {
    disconnectDatabase();
  });

  it('test 1', () => { /* ... */ });
  it('test 2', () => { /* ... */ });
});
```

### Pattern 5: Testing Side Effects

```javascript
it('should call callback function', () => {
  const callback = jest.fn();
  
  processData('input', callback);
  
  expect(callback).toHaveBeenCalled();
  expect(callback).toHaveBeenCalledWith(expect.any(Object));
});
```

---

## Best Practices

### 1. **One Assertion Per Test (Ideally)**

❌ **Bad:**
```javascript
it('should handle user operations', () => {
  expect(createUser()).toBeTruthy();
  expect(updateUser()).toBeTruthy();
  expect(deleteUser()).toBeTruthy();
});
```

✅ **Good:**
```javascript
it('should create user', () => {
  expect(createUser()).toBeTruthy();
});

it('should update user', () => {
  expect(updateUser()).toBeTruthy();
});

it('should delete user', () => {
  expect(deleteUser()).toBeTruthy();
});
```

### 2. **Use Descriptive Test Names**

❌ **Bad:**
```javascript
it('test 1', () => { /* ... */ });
it('works', () => { /* ... */ });
it('user test', () => { /* ... */ });
```

✅ **Good:**
```javascript
it('should reject registration with duplicate email', () => { /* ... */ });
it('should return 404 when book not found', () => { /* ... */ });
it('should increment book quantity when returned', () => { /* ... */ });
```

### 3. **Test Both Happy and Sad Paths**

```javascript
describe('addBook', () => {
  // Happy path - everything works
  it('should add book with valid data', () => { /* ... */ });
  
  // Sad paths - things go wrong
  it('should reject duplicate ISBN', () => { /* ... */ });
  it('should reject missing title', () => { /* ... */ });
  it('should reject negative quantity', () => { /* ... */ });
  it('should handle database errors', () => { /* ... */ });
});
```

### 4. **Keep Tests Independent**

❌ **Bad:**
```javascript
let user;

it('should create user', () => {
  user = createUser();  // Test 2 depends on this!
});

it('should update user', () => {
  updateUser(user);  // Breaks if test 1 fails!
});
```

✅ **Good:**
```javascript
it('should create user', () => {
  const user = createUser();
  expect(user).toBeTruthy();
});

it('should update user', () => {
  const user = createUser();  // Independent setup
  updateUser(user);
  expect(user.updated).toBe(true);
});
```

### 5. **Don't Test Implementation Details**

❌ **Bad:**
```javascript
it('should call helper function', () => {
  // Testing HOW it works (implementation)
  expect(helperFunction).toHaveBeenCalled();
});
```

✅ **Good:**
```javascript
it('should return correct result', () => {
  // Testing WHAT it does (behavior)
  expect(calculate(5, 3)).toBe(8);
});
```

### 6. **Use beforeEach for Common Setup**

```javascript
describe('User tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Common setup for all tests
    mockReq = { body: {}, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('test 1', () => {
    // Use mockReq and mockRes
  });

  it('test 2', () => {
    // Use mockReq and mockRes
  });
});
```

### 7. **Clear Mock Data Between Tests**

```javascript
beforeEach(() => {
  jest.clearAllMocks();  // Clear call history
  // or
  jest.resetAllMocks();  // Clear call history AND implementations
});
```

---

## Common Mistakes to Avoid

### Mistake 1: Not Mocking External Dependencies

❌ **Bad:**
```javascript
it('should save to database', async () => {
  await saveUser(userData);  // Actually hits the database!
});
```

✅ **Good:**
```javascript
jest.mock('../../config/database.js');

it('should save to database', async () => {
  db.one.mockResolvedValue({ id: 1 });
  await saveUser(userData);  // Uses mock
  expect(db.one).toHaveBeenCalled();
});
```

### Mistake 2: Testing Too Much in One Test

❌ **Bad:**
```javascript
it('should handle entire user flow', () => {
  register();
  login();
  updateProfile();
  changePassword();
  logout();
  // If this fails, which part broke?
});
```

✅ **Good:**
```javascript
it('should register user', () => { /* ... */ });
it('should login user', () => { /* ... */ });
it('should update profile', () => { /* ... */ });
```

### Mistake 3: Forgetting to Test Edge Cases

```javascript
// Don't forget to test:
it('should handle empty string', () => { /* ... */ });
it('should handle null value', () => { /* ... */ });
it('should handle undefined', () => { /* ... */ });
it('should handle zero', () => { /* ... */ });
it('should handle negative numbers', () => { /* ... */ });
it('should handle very large numbers', () => { /* ... */ });
```

### Mistake 4: Not Using async/await Properly

❌ **Bad:**
```javascript
it('should fetch data', () => {
  fetchData().then(data => {
    expect(data).toBeDefined();
  });
  // Test finishes before promise resolves!
});
```

✅ **Good:**
```javascript
it('should fetch data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});
```

### Mistake 5: Hard-Coding Mock Data

❌ **Bad:**
```javascript
mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  password: '$2b$10$abc123...',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};
```

✅ **Good:**
```javascript
// Only include what's needed for the test
mockUser = {
  id: 1,
  email: 'john@example.com'
};
```

---

## Running and Debugging Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test -- generateToken.test.js
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```
Changes to code automatically re-run tests!

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Only One Test
```javascript
it.only('should test this one', () => {
  // Only this test will run
});
```

### Skip a Test
```javascript
it.skip('should test this later', () => {
  // This test will be skipped
});
```

### Debug a Test
```javascript
it('should debug this', () => {
  console.log('Debug info:', someVariable);
  debugger;  // Set breakpoint here
  expect(result).toBe(expected);
});
```

### Understanding Test Output

```
PASS  src/__test__/utils/generateToken.test.js
  generateToken Utility
    ✓ should generate a valid JWT token (15ms)
    ✓ should set HTTP-only cookie with correct options (3ms)

FAIL  src/__test__/controller/authController.test.js
  Auth Controller
    login
      ✓ should login with valid credentials (25ms)
      ✕ should reject invalid password (12ms)

  ● Auth Controller › login › should reject invalid password

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: 400
    Received: 401

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 3 passed, 4 total
```

**Reading this:**
- ✅ `PASS` = All tests in this file passed
- ❌ `FAIL` = At least one test failed
- ✓ = Individual test passed
- ✕ = Individual test failed
- Time in parentheses = How long test took

---

## Test Coverage Explained

### What is Coverage?

**Coverage** measures how much of your code is tested.

### Coverage Metrics

```
File                | % Stmts | % Branch | % Funcs | % Lines
--------------------|---------|----------|---------|--------
authController.js   |   85.7  |   75.0   |  100.0  |  85.7
```

**Metrics explained:**
- **Statements** - Percentage of statements executed
- **Branch** - Percentage of if/else branches tested
- **Functions** - Percentage of functions called
- **Lines** - Percentage of lines executed

### Example: Understanding Branch Coverage

```javascript
function checkAge(age) {
  if (age >= 18) {        // ← Branch 1
    return 'adult';
  } else {                // ← Branch 2
    return 'minor';
  }
}

// This test only covers Branch 1 (50% branch coverage)
it('should return adult', () => {
  expect(checkAge(20)).toBe('adult');
});

// Add this test for 100% branch coverage
it('should return minor', () => {
  expect(checkAge(15)).toBe('minor');
});
```

### Good Coverage Targets

- 🎯 **80%+** is excellent
- 👍 **60-80%** is good
- ⚠️ **40-60%** needs improvement
- ❌ **<40%** is risky

**Note:** 100% coverage doesn't mean bug-free! Quality > Quantity.

---

## Quick Reference

### Jest Commands

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
npm test -- file.test.js   # Run specific file
```

### Common Jest Functions

```javascript
// Organizing tests
describe('group name', () => { /* tests */ });
it('test name', () => { /* test */ });
test('test name', () => { /* test */ });

// Setup/Teardown
beforeAll(() => { /* runs once before all tests */ });
beforeEach(() => { /* runs before each test */ });
afterEach(() => { /* runs after each test */ });
afterAll(() => { /* runs once after all tests */ });

// Mocking
jest.fn()                          // Mock function
jest.fn().mockReturnValue(value)   // Return value
jest.fn().mockResolvedValue(value) // Resolve promise
jest.fn().mockRejectedValue(error) // Reject promise
jest.clearAllMocks()               // Clear mocks

// Common Assertions
expect(value).toBe(expected)
expect(value).toEqual(expected)
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(fn).toHaveBeenCalled()
expect(fn).toHaveBeenCalledWith(arg)
```

---

## Next Steps

### 1. **Practice Writing Tests**
Start with simple functions, then move to complex ones.

### 2. **Read Your Test Output**
When tests fail, read the error message carefully.

### 3. **Write Tests First (TDD)**
Try Test-Driven Development:
1. Write test (it fails)
2. Write code to make it pass
3. Refactor

### 4. **Aim for Good Coverage**
Try to get 80%+ coverage on important code.

### 5. **Learn from Others**
Read tests in open-source projects to see patterns.

---

## Additional Resources

### Documentation
- [Jest Official Docs](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)

### Books
- "Test-Driven Development by Example" by Kent Beck
- "The Art of Unit Testing" by Roy Osherove

### Online Courses
- [JavaScript Testing Best Practices](https://testingjavascript.com/)

---

## Summary

### Key Takeaways

1. **Unit tests verify individual pieces of code work correctly**
2. **Use the AAA pattern: Arrange, Act, Assert**
3. **Mock external dependencies (databases, APIs, etc.)**
4. **Write descriptive test names that explain what's being tested**
5. **Test both success and failure cases**
6. **Keep tests independent and isolated**
7. **Aim for 80%+ code coverage**
8. **Run tests before every commit**
9. **Tests are documentation - they show how code should work**
10. **Good tests give you confidence to change code**

---

## Questions to Ask Yourself

Before writing a test:
- ✅ What am I testing?
- ✅ What should happen?
- ✅ What inputs do I need?
- ✅ What should I mock?
- ✅ What's the expected output?

When a test fails:
- ❌ Is my code wrong?
- ❌ Is my test wrong?
- ❌ Did I set up mocks correctly?
- ❌ Did I use async/await properly?
- ❌ Is my assertion correct?

---

**Happy Testing! 🎉**

Remember: Writing tests takes time upfront but saves hours of debugging later!

