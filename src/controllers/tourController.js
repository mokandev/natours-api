/* eslint-disable prefer-object-spread */

const Tour = require('../models/tourModel');

// 2) ROUTE HANDLERS = CONTROLLERS

const checkBody = (req, res, next) => {
  const { name, price } = req.body;

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
    // results: tours.length,
    // data: { tours },
    requestedAt: req.requestTime,
  });
};

const getTourById = (req, res) => {
  const tourId = req.params.id;
  // const tour = tours.find((el) => el.id === Number(tourId));

  // return res.status(200).json({ status: 'success', data: { tour } });
};

const createTour = (req, res) => {
  const tour = req.body;
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, tour);

  // return res.status(201).json({
  //   status: 'success',
  //   data: {
  //     tour: newTour,
  //   },
  // });
};

const updateTour = (req, res) => {
  const tourId = req.params.id;
  // const tour = tours.find((el) => el.id === Number(tourId));
  // const updatedTour = { ...tour, ...req.body };

  return res.status(200).json({
    status: 'success',
    data: {
      // tour: updatedTour,
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
  checkBody,
};
