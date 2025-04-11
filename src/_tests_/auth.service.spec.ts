import authService from '../services/auth.service';
import { getAppDataSource } from '../data-source';
import { Hash } from '../shared/util/hash.util';
import { User } from '../entity/user.entity';

jest.mock('../data-source', () => ({
  getAppDataSource: jest.fn(),
}));

jest.mock('../shared/util/hash.util', () => ({
  Hash: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('authService', () => {
  let userRepoMock: any;

  beforeEach(() => {
    userRepoMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    (getAppDataSource as jest.Mock).mockReturnValue({
      getRepository: () => userRepoMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should return 400 if email already exists', async () => {
      const res = mockRes();
      userRepoMock.findOne.mockResolvedValue({ id: 1 });

      await authService.signup(res, {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email already exists' });
    });

    it('should create and return new user without password', async () => {
      const res = mockRes();
      const hashed = 'hashedpassword';
      const fakeUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: hashed,
      };

      userRepoMock.findOne.mockResolvedValue(null);
      (Hash.hash as jest.Mock).mockResolvedValue(hashed);
      userRepoMock.create.mockReturnValue(fakeUser);
      userRepoMock.save.mockResolvedValue(fakeUser);

      await authService.signup(res, {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      });
    });
  });

  describe('login', () => {
    it('should return 401 if user not found or password mismatch', async () => {
      const res = mockRes();
      userRepoMock.findOne.mockResolvedValue(null);

      const result = await authService.login(res, {
        email: 'notfound@example.com',
        password: 'wrong',
      });

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found or incorrect password' });
      expect(result).toBeUndefined();
    });

    it('should return user data without password if login is successful', async () => {
      const res = mockRes();
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
      };

      userRepoMock.findOne.mockResolvedValue(user);
      (Hash.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(res, {
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      });
    });
  });
});
