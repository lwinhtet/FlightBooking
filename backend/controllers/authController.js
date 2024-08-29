import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;
import { promisify } from 'util';
import prisma from '../prisma/client.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import bcrypt from 'bcryptjs';

const signToken = (id) => {
  return sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  //Signing JWT
  // id for payload, secret, jwt expire
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: 'Lax',
    path: '/',
    // secure: true
  };
  // only be send in encrypted connection if in production
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  // if (req.secure) cookieOptions.secure = true;
  res.cookie('accessToken', token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return next(new AppError('Email is already registered', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  console.log(email, password);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res);
});

export function logout(req, res) {
  res.cookie('accessToken', 'logged-out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
}

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // value of the promise is the decoded payload from JWT
  // checking user payload is manipulated or not
  const decoded = await promisify(verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  const id = decoded.id;
  const freshUser = await prisma.user.findUnique({ where: { id } });
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist!',
        401
      )
    );
  }

  req.user = freshUser;
  next();
});
