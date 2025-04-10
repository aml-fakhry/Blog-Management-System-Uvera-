import { NextFunction, Request, Response } from 'express';
import { JWT } from '../util/jwt.util';

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
