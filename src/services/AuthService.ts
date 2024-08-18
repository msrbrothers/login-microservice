import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/UserModel';
import { JwtUtil } from '../utils/JwtUtil';

export class AuthService {
  public static async register(username: string, email: string, password: string): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    return await user.save();
  }

  public static async login(email: string, password: string): Promise<string | null> {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const token = JwtUtil.generateToken({ id: user._id });
    return token;
  }
}
