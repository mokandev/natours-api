const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) MIDDLEWARES
// Passing a middleware to app to read req body.
app.use(morgan('combined'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello From the Middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES

// HERE IS WHERE WE MOUNT THE ROUTES
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

module.exports = app;
