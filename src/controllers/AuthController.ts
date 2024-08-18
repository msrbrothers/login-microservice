import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body;

    try {
      const user = await AuthService.register(username, email, password);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', error });
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const token = await AuthService.login(email, password);
      if (token) {
        res.status(200).json({ message: 'Login successful', token });
      } else {
        res.status(400).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error });
    }
  }
}
