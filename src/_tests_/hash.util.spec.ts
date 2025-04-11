import bcrypt from 'bcrypt';
import { Hash } from '../shared/util/hash.util';

jest.mock('bcrypt');

describe('Hash Utility', () => {
  const mockSalt = 'mockSalt';
  const mockHash = 'mockHashedValue';
  const testData = 'password123';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.HASHING_SALT_ROUNDS = '10';
  });

  describe('hash()', () => {
    it('should hash the data with generated salt', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

      const result = await Hash.hash(testData);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(testData, mockSalt);
      expect(result).toBe(mockHash);
    });
  });

  describe('compare()', () => {
    it('should compare plain and hashed data correctly', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await Hash.compare(testData, mockHash);

      expect(bcrypt.compare).toHaveBeenCalledWith(testData, mockHash);
      expect(result).toBe(true);
    });
  });
});
