import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';


const authMiddleware = async (req, res, next) => {
  {
    let token
    if (req.cookies?.jwt && req.cookies.jwt !== 'undefined') {
      token = req.cookies.jwt;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({
        status:'error',
        message: 'Unauthorized' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await db.oneOrNone('SELECT * FROM "User" WHERE "id" = $1', [decoded.id]);
      if (!user) {
        return res.status(401).json({ status:'error', message: 'User not found' });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ status:'error', message: 'Not Authorized, Invalid Token' });
    }

  }
}

export default authMiddleware;