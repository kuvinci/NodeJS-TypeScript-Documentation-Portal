// import { Request } from 'express';
import { Request } from 'express';
import 'express-session';
import { User } from '../src/models/User';

declare module 'express-session' {
    export interface SessionData {
        user?: any; // You can replace 'any' with the specific type of your 'candidate' object.
        isAuthenticated?: boolean;
    }
}

declare module 'express' {
    export interface Request {
        user?: any;
    }
}

declare module 'mongoose' {
    export interface ConnectOptions {
        useNewUrlParser: Boolean;
    }
}
