import jsonwebtoken from 'jsonwebtoken';
import { JWT } from '../shared/util/jwt.util';


jest.mock('jsonwebtoken');

describe('JWT Utility', () => {
  const mockToken = 'mock.jwt.token';
  const userId = 'user123';
  const role = 'admin';
  const payloadWithRole = { userId, role };
  const payloadWithoutRole = { userId };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_PRIVATE_KEY = 'super-secret';
  });

  describe('genToken()', () => {
    it('should sign JWT with role', async () => {
      (jsonwebtoken.sign as jest.Mock).mockReturnValue(mockToken);

      const token = await JWT.genToken(userId, role);

      expect(jsonwebtoken.sign).toHaveBeenCalledWith(
        payloadWithRole, // payload includes userId only if role is truthy
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: '10d' }
      );
      expect(token).toBe(mockToken);
    });

    it('should sign JWT without role', async () => {
      (jsonwebtoken.sign as jest.Mock).mockReturnValue(mockToken);

      const token = await JWT.genToken(userId, undefined);

      expect(jsonwebtoken.sign).toHaveBeenCalledWith(
        payloadWithoutRole, // logic adds role only if it’s falsy (your logic might be inverted, see note below)
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: '10d' }
      );
      expect(token).toBe(mockToken);
    });
  });

  describe('verifyAndDecode()', () => {
    it('should return decoded payload if token is valid', async () => {
      const decodedPayload = { userId: 'user123' };
      (jsonwebtoken.verify as jest.Mock).mockReturnValue(decodedPayload);

      const result = await JWT.verifyAndDecode(mockToken);

      expect(jsonwebtoken.verify).toHaveBeenCalledWith(
        mockToken,
        process.env.JWT_PRIVATE_KEY,
        { ignoreExpiration: false }
      );
      expect(result).toEqual(decodedPayload);
    });

    it('should return null if token is invalid or throws', async () => {
      (jsonwebtoken.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = await JWT.verifyAndDecode(mockToken);

      expect(result).toBeNull();
    });

    it('should pass ignoreExpiration as true when requested', async () => {
      (jsonwebtoken.verify as jest.Mock).mockReturnValue({ userId: 'x' });

      await JWT.verifyAndDecode(mockToken, true);

      expect(jsonwebtoken.verify).toHaveBeenCalledWith(
        mockToken,
        process.env.JWT_PRIVATE_KEY,
        { ignoreExpiration: true }
      );
    });
  });
});
