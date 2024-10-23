import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../types/types';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      res.status(401).json({ status: 'error', message: 'Unauthorized: No token provided' });
      return
    }

    const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as jwt.JwtPayload;
    // @ts-ignore
    req.user = user as IUser;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ status: 'error', message: 'Unauthorized: Invalid or Expired token' });
      return
    }
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
};
