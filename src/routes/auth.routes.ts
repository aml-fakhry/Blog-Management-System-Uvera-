import { Router } from 'express';
import { JWT } from '../shared/util/jwt.util';
import authService from '../services/auth.service';

/**
 * The user router that holds all module routes.
 */
export const userRouter = Router();

/**
 * The relative route for the auth.
 */
export const userRelativeRoute = '';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */

/** Sign up new user. */
userRouter.post('/signup', async (req, res) => {
  await authService.signup(res, req.body);
});

/* Login user. */
userRouter.post('/login', async (req, res) => {
  const user = await authService.login(res, req.body);
  if (!user) {
    return;
  }
  const jwt = await JWT.genToken(user?.id ?? 0, user.role);

  res.send({ data: { user: user, token: jwt } });
});
