import { Response } from 'express';
import { Hash } from '../shared/util/hash.util';
import { AppDataSource } from '../data-source';
import { User } from '../entity/user';

/**
 * A auth service class contain functionality for signup and login.
 */
class authService {
  /** Sign up new user. */
  async signup(res: Response, data: { email: any; password: any; name: any }) {
    try {
      const userRepo = AppDataSource.getRepository(User);

      // Check if email exists
      const existingUser = await userRepo.findOne({ where: { email: data.email } });

      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Hash password
      const hashedPassword = await Hash.hash(data.password);

      // Create and save user
      const newUser = userRepo.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
      });

      const savedUser = await userRepo.save(newUser);

      // Remove password before sending back
      const { password, ...userWithoutPassword } = savedUser;
      return res.status(201).json(userWithoutPassword);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }

  /** Login user method. */
  async login(res: Response, data: { email: any; password: any }) {
    try {
      const userRepo = AppDataSource.getRepository(User);

      // Find user by email
      const user = await userRepo.findOne({ where: { email: data.email } });

      // Check user and password
      if (!user || !(await Hash.compare(data.password, user.password))) {
        res.status(401).json({ message: 'User not found or incorrect password' });
        return undefined;
      }

      // Remove password before sending
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Login failed' });
      return undefined;
    }
  }
}

export default new authService();
