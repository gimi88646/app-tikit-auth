import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface IUserPayload {
  id: string;
  email: string;
}
declare global {
  namespace Express {
    interface Request {
      currentUser?: IUserPayload;
    }
  }
}

const currentUser = (req: Request, res: Response, next: NextFunction) => {
  // if jsonwentoken doesn't exist just go to next middleware
  if (req.session?.jwt) {
    try {
      const payload = jwt.verify(
        req.session.jwt,
        process.env.JWT_KEY!
      ) as IUserPayload;
      req.currentUser = payload;
    } catch (err) {}
  }
  next();
};
export { currentUser };
