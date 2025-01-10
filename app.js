const fs = require('fs');
const express = require('express');

const app = express();

// Passing a middleware to app to read req body.
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello From the Middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next()
});

const PORT = 8000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  
  return res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours }, requestedAt: req.requestTime });
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
    },
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

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getTourById);

// app.post('/api/v1/tours', createTour);

// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
