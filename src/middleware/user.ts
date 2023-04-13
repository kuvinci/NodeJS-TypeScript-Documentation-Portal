import { Request, Response, NextFunction } from 'express';
import User from '../models/User';


const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    next();
  } else {
    req.user = await User.findById(req.session.user._id);
    next();
  }
};

export default userMiddleware;