const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../../dev-data/data/tours-simple.json`),
);

// 2) ROUTE HANDLERS = CONTROLLERS

const checkID = (req, res, next, val) => {
  console.log(`Tourd id is: ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

const checkBody = (req, res, next) => {
  const { name, price } = req.body;
  console.log('name', name, 'price', price);

  if (!name || !price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid request body',
    });
  }
  next();
};

const getAllTours = (req, res) => {
  console.log(req.requestTime);

  return res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
    requestedAt: req.requestTime,
  });
};

const getTourById = (req, res) => {
  const tourId = req.params.id;
  const tour = tours.find((el) => el.id === Number(tourId));

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
  const updatedTour = { ...tour, ...req.body };

  return res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour,
    },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

module.exports = {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody,
};
