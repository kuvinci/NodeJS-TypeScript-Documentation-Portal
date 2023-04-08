import { Request } from 'express';
import User from './models/User';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: User;
  }
}

declare module 'express-session' {
  interface SessionData {
    isAuthenticated: boolean;
    user: IUser;
  }
}
