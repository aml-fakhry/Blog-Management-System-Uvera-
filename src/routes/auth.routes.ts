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
  const jwt = await JWT.genToken(user?.id ?? 0, user.role?.name);

  res.send({ data: { user: user, token: jwt } });
});
