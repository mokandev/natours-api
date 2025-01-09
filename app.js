const fs = require('fs');
const express = require('express');

const app = express();

// Passing a middleware to app to read req body.
app.use(express.json());

const PORT = 8000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

app.get('/api/v1/tours', (req, res) => {
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
});

app.get('/api/v1/tours/:id', (req, res) => {
  const tourId = req.params.id;

  const tour = tours.find((el) => el.id === Number(tourId));

  // if(tourId > tours.length) {
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid tour id' });
  }

  res.status(200).json({ status: 'success', data: { tour } });
});

app.post('/api/v1/tours', (req, res) => {
  const tour = req.body;

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, tour);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const tourId = req.params.id;

  const tour = tours.find((el) => el.id === Number(tourId));
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid tour id' });
  }

  const updatedTour = { ...tour, ...req.body };

  res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour,
    }
  })
});

app.delete('/api/v1/tours/:id', (req, res) => {
  const tourId = req.params.id;

  const tour = tours.find((el) => el.id === Number(tourId));
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid tour id' });
  }


  res.status(204).json({
    status: 'success',
    data: null
  })
});


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
