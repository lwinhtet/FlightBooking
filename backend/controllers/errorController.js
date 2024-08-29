import { PrismaClientInitializationError } from '@prisma/client/runtime/library';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import AppError from '../utils/appError.js';

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Operational error
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programmer error
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong! Try again Later.',
    });
  }
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${err.meta.target}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleRecordNotFoundDB = (err) => {
  const message = 'Record not found';
  return new AppError(message, 404);
};

const handleInitializationErrorDB = (err) => {
  const message = 'Error initializing Prisma client';
  return new AppError(message, 500);
};

const handleJWTError = () =>
  new AppError('Invalid Token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again!', 401);

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, name: err.name };
    error.message = err.message;

    // Prisma Client throws a PrismaClientKnownRequestError exception if the query engine
    // returns a known error related to the request - for example, a unique constraint violation.
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        error = handleDuplicateFieldsDB(err);
      } else if (err.code === 'P2025') {
        error = handleRecordNotFoundDB(err);
      }
      // Add other Prisma-specific error codes if needed
    }

    if (err instanceof PrismaClientValidationError) {
      // Handle Prisma client validation errors
      error = handleValidationErrorDB(err);
    }

    // if something goes wrong when the query engine is started and the connection to the database is created
    if (err instanceof PrismaClientInitializationError) {
      // Handle Prisma client initialization errors
      error = handleInitializationErrorDB(err);
    }

    sendErrorProd(error, res);
  }
};
