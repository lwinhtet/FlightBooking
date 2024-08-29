import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import AppError from './utils/appError.js';
import flightRouter from './routes/flightRoutes.js';
import userRouter from './routes/userRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import globalErrorHandler from './controllers/errorController.js';

const app = express();

app.use(helmet());

app.use(
  cors({
    credentials: true,
    origin: true,
    // origin: ['http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached
});

app.use(limiter);

// body parser, express does not put body data on req, so we do this
app.use(express.json({ limit: '10kb' }));

app.use(cookieParser());

// app.post('/example', [
//   body('email').isEmail().normalizeEmail(),
//   body('name').trim().escape(),
// ], (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   // Process sanitized input
//   const { email, name } = req.body;
//   res.send(`Email: ${email}, Name: ${name}`);
// });

// app.disable('x-powered-by');

// servering static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(compression());

app.use('/api/v1/flights', flightRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
