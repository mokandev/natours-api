const fs = require('fs');
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

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// 2) ROUTE HANDLERS

const getAllTours = (req, res) => {
  console.log(req.requestTime);

  return res
    .status(200)
    .json({
      status: 'success',
      results: tours.length,
      data: { tours },
      requestedAt: req.requestTime,
    });
};

const getTourById = (req, res) => {
  const tourId = req.params.id;

  const tour = tours.find((el) => el.id === Number(tourId));

  // if(tourId > tours.length) {
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid tour id' });
  }

  return res.status(200).json({ status: 'success', data: { tour } });
};

const createTour = (req, res) => {
  const tour = req.body;

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, tour);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      return res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  const tourId = req.params.id;

  const tour = tours.find((el) => el.id === Number(tourId));
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid tour id' });
  }

  const updatedTour = { ...tour, ...req.body };

  return res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour,
    },
  });
};

const deleteTour = (req, res) => {
  const tourId = req.params.id;

  const tour = tours.find((el) => el.id === Number(tourId));
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid tour id' });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const getUserById = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getTourById);

// app.post('/api/v1/tours', createTour);

// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);

// 3) ROUTES

const tourRouter = express.Router()
const userRouter = express.Router()
app.use('/api/v1/users', userRouter)
app.use('/api/v1/tours', tourRouter)

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter
  .route('/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter
  .route('/:id')
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

// 4) START SERVER
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
