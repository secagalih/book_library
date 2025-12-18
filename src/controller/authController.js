// import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { db } from "../config/database.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const userExsits = await db.oneOrNone('SELECT * FROM "User" WHERE "email" = $1', [email]);

  if (userExsits) {
    return res.status(400).json({ status: 'error', message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await db.one('INSERT INTO "User" ("name", "email", "password") VALUES ($1, $2, $3) RETURNING *', [name, email, hashedPassword]);

  const token = generateToken(user.id, res);

  res.status(201).json({
    status: 'success',
    message: 'Registered successfully',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token: token
    }
  })

};

const login = async (req, res) => {
  const { email, password } = req.body

  const user = await db.oneOrNone('SELECT * FROM "User" WHERE "email" = $1', [email]);

  if (!user) {
    return res.status(401).json({
      status: 'error',
      message: "Invalid Email and Password"
    })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      status: 'error',
      message: "Invalid Password and Email"
    })
  }

  const token = generateToken(user.id, res);

  return res.status(201).json({
    status: 'success',
    message: 'Logged in successfully',
    data: {
      user: {
        id: user.id,
        email: user.email
      },
      token: token
    }
  })
}

const logout = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  })
  return res.status(201).json({
    status: 'success',
    message: 'Logged out successfully'
  })

}

const getUser = async (req, res) => {
  const { id } = req.user;
  const user = await db.oneOrNone('SELECT * FROM "User" WHERE "id" = $1', [id]);
  if (!user || !req.cookies.jwt) {
    return res.status(404).json({ status: 'error', message: 'Invalid token' });
  }
  return res.status(201).json({
    status: 'success',
    message: 'User found', user: {
      id: user.id,
      name: user.name,
      email: user.email
    }, 
  });
}

const getAllUsers = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const pageNumber = Math.max(1, parseInt(page) || 1);
  const limitNumber = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const offset = (pageNumber - 1) * limitNumber;

  let query;
  let countQuery;
  let params = [];
  let countParams = [];

  if (search) {
    query = `
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
    `
    params = [`%${search}%`, limitNumber, offset]
    countQuery = `
    SELECT COUNT(*) FROM "User" 
      WHERE "name" ILIKE $1
      OR "email" ILIKE $1
    `
    countParams = [`%${search}%`]
  } else {
    query = `
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
    GROUP BY u."id", u."name", u."email", u."createdAt"
    ORDER BY u."name" ASC
    LIMIT $1 OFFSET $2
    `
    params = [limitNumber, offset]
    countQuery = 'SELECT COUNT(*) FROM "User"'
    countParams = []
  }

  const [users, countResult] = await Promise.all([
    db.any(query, params),
    db.one(countQuery, countParams)
  ])

  const totalItems = parseInt(countResult.count)
  const totalPages = Math.ceil(totalItems / limitNumber)

  res.status(200).json({
    status: 'success',
    message: 'User Found',
    data:{
        users :users
    },
    paination: {
      currentPage: pageNumber,
      itemsPerPage: limitNumber,
      totalItems: totalItems,
      totalPages: totalPages,
      hasNextPage: pageNumber < totalPages,
      hasPreviousPage: pageNumber > 1
    }
  })

}

const getTotalUsers = async (req, res) => {
  const totalUsers = await db.one('SELECT COUNT(*) FROM "User"');
  return res.status(201).json({
    status: 'success',
    message: 'Total users found',
    data: {
      totalUsers: totalUsers.count
    },
  })
}

export { register, login, logout, getUser, getTotalUsers, getAllUsers };