import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../config/jwt';
import AppError from '../config/app.error';

export interface UserRequest extends Request {
  user?: number;
}

export const auth = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let access_token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1];
    }

    if (!access_token) {
      return next(new AppError(401, 'Unauthorized'));
    }

    // Validate the access token
    const decoded = verifyToken<{ userId: number }>(
      access_token,
      'accessTokenPublicKey'
    );

    if (!decoded) {
      return next(new AppError(401, `Invalid token`));
    }
    req.user = decoded.userId;
    next();
  } catch (err: any) {
    next(err);
  }
};
