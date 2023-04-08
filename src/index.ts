import express, { Request, Response, NextFunction } from 'express';
import csrf from 'csurf';
import flash from 'connect-flash';
import mongoose from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import { create as createHandlebars } from 'express-handlebars';
import session from 'express-session';
import { default as MongoSession } from 'connect-mongodb-session';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import homeRoutes from './routes/home';
// import BPRoutes from './routes/bestPractices';
// import addBP from './routes/addBP';
// import account from './routes/account';
// import auth from './routes/auth';
// import varMiddleware from './middleware/variables';
// import userMiddleware from './middleware/user';
// import errorHandler from './middleware/error';
// import keys from './keys';

const app = express();
const MongoDBStore = MongoSession(session);

const hbs = createHandlebars({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
});

// const store = new MongoDBStore({
//     collection: 'sessions',
//     uri: keys.MONGODB_URI,
// });

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'src/views');

app.use(express.static('src/public'));
app.use(express.urlencoded({ extended: true }));
// app.use(
//     session({
//         secret: keys.SESSION_SECRET,
//         resave: false,
//         saveUninitialized: false,
//         store,
//     })
// );
// app.use(csrf());
app.use(flash());
app.use(helmet());
app.use(compression());
// app.use(varMiddleware);
// app.use(userMiddleware);
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; font-src *; connect-src 'self' https://ka-f.fontawesome.com; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; img-src 'self' https://cdnjs.cloudflare.com;"
    );
    next();
});

app.use('/', homeRoutes);
// app.use('/best_practices', BPRoutes);
// app.use('/add', addBP);
// app.use('/account', account);
// app.use('/auth', auth);

// app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        // await mongoose.connect(keys.MONGODB_URI, { useNewUrlParser: true });

        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();