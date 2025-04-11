import { NextFunction, Request, Response } from 'express';
import { JWT } from '../util/jwt.util';
import { Roles } from './roles.enum';

/**
 * Authenticates the coming request by validating the jwt against validity and expiration.
 * @param req The express request.
 * @param res The express response.
 * @param next The next function in the pipeline.
 */
export async function Authenticate(req: Request & { user?: any }, res: Response, next: NextFunction) {
  try {
    const jwtData = await JWT.verifyAndDecode(req.headers.authorization || '');

    if (jwtData) {
      req.user = {
        userId: jwtData.userId,
        role: jwtData.role ?? '',
      };

      next();
    } else {
      res.status(401).send('No valid access token provided');
      return;
    }
  } catch (error) {
    console.log({ error });
  }
}

/** Access is granted if the user has any of the provided roles */
export function Authorize(...roles: Roles[]) {
  return async (req: Request & { user?: any }, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (roles.length) {
        const authorized = roles.some((role) => role === req.user.role);
        if (!authorized) {
          res.status(401).send('Access denied');
          return;
        }
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
      return;
    }
  };
}
