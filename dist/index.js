"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const csurf_1 = __importDefault(require("csurf"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const mongoose_1 = __importDefault(require("mongoose"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_handlebars_1 = require("express-handlebars");
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const handlebars_1 = __importDefault(require("handlebars"));
const allow_prototype_access_1 = require("@handlebars/allow-prototype-access");
const home_1 = __importDefault(require("./routes/home"));
const bestPractices_1 = __importDefault(require("./routes/bestPractices"));
const addBP_1 = __importDefault(require("./routes/addBP"));
const account_1 = __importDefault(require("./routes/account"));
const auth_1 = __importDefault(require("./routes/auth"));
const variables_1 = __importDefault(require("./middleware/variables"));
const user_1 = __importDefault(require("./middleware/user"));
const error_1 = __importDefault(require("./middleware/error"));
const keys_1 = __importDefault(require("./keys"));
const app = (0, express_1.default)();
const MongoDBStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
const hbs = (0, express_handlebars_1.create)({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: (0, allow_prototype_access_1.allowInsecurePrototypeAccess)(handlebars_1.default),
});
const store = new MongoDBStore({
    collection: 'sessions',
    uri: keys_1.default.MONGODB_URI,
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'src/views');
app.use(express_1.default.static('src/public'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: keys_1.default.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
}));
app.use((0, csurf_1.default)());
app.use((0, connect_flash_1.default)());
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use(variables_1.default);
app.use(user_1.default);
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; font-src *; connect-src 'self' https://ka-f.fontawesome.com; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; img-src 'self' https://cdnjs.cloudflare.com;");
    next();
});
app.use('/', home_1.default);
app.use('/best_practices', bestPractices_1.default);
app.use('/add', addBP_1.default);
app.use('/account', account_1.default);
app.use('/auth', auth_1.default);
app.use(error_1.default);
const PORT = process.env.PORT || 3000;
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(keys_1.default.MONGODB_URI, { useNewUrlParser: true });
            app.listen(PORT, () => {
                console.log(`Server is running on port: ${PORT}`);
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
start();
