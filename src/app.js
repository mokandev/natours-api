const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) MIDDLEWARES
// Passing a middleware to app to read req body.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
// Middleware to allow express to serve static files from some directory
app.use(express.static(`${__dirname}/public`));

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


// ERROR HANDLER MUST BE DEFINED AFTER OTHER HANDLERS, SO IF THE OTHER ROUTES DONT MATCH IT, IT WILL BE CALLED.
app.all('*', (req, res) => {
  res
    .status(404)
    .json({
      status: 'fail',
      message: `Can't find ${req.originalUrl} on this server!`,
    });
});

module.exports = app;
