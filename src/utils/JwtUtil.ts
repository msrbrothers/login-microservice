import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class JwtUtil {
  public static generateToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET || '', { expiresIn: '1h' });
  }

  public static verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || '');
    } catch (error) {
      return null;
    }
  }
}
