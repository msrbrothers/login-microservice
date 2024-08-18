import bcrypt from 'bcryptjs';
import { User } from '../models/UserModel';
import { JwtUtil } from '../utils/JwtUtil';
import { AuthService } from './AuthService';

// Automatically mock the dependencies
jest.mock('bcryptjs');
jest.mock('../models/UserModel');
jest.mock('../utils/JwtUtil');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user with a hashed password', async () => {
    const username = 'testUser';
    const email = 'test@example.com';
    const password = 'password';
    const hashedPassword = 'hashedPassword';

    // Mock bcrypt.hash
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    // Mock User.prototype.save
    const saveMock = jest.fn().mockResolvedValue({ username, email, password: hashedPassword });
    // Use spyOn to mock instance methods
    jest.spyOn(User.prototype, 'save').mockImplementation(saveMock);

    const user = await AuthService.register(username, email, password);

    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(saveMock).toHaveBeenCalled();
    expect(user).toEqual({ username, email, password: hashedPassword });
  });

  it('should return a token for valid login', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const hashedPassword = 'hashedPassword';
    const token = 'jwtToken';

    // Mock bcrypt.compare
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    // Mock User.findOne
    (User.findOne as jest.Mock).mockResolvedValue({ _id: 'userId', password: hashedPassword });

    // Mock JwtUtil.generateToken
    (JwtUtil.generateToken as jest.Mock).mockReturnValue(token);

    const result = await AuthService.login(email, password);

    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(JwtUtil.generateToken).toHaveBeenCalledWith({ id: 'userId' });
    expect(result).toBe(token);
  });

  it('should return null for invalid login credentials', async () => {
    const email = 'test@example.com';
    const password = 'wrongPassword';
    const hashedPassword = 'hashedPassword';

    // Mock bcrypt.compare
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    // Mock User.findOne
    (User.findOne as jest.Mock).mockResolvedValue({ _id: 'userId', password: hashedPassword });

    const result = await AuthService.login(email, password);

    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(JwtUtil.generateToken).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should return null if user is not found', async () => {
    const email = 'nonexistent@example.com';
    const password = 'password';

    // Mock User.findOne
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const result = await AuthService.login(email, password);

    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(JwtUtil.generateToken).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
