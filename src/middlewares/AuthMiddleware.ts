import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/JwtUtil';

export class AuthMiddleware {
  public static authenticate(req: Request, res: Response, next: NextFunction): any {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = JwtUtil.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.body.user = decoded;
    next();
  }
}
