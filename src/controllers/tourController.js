/* eslint-disable prefer-object-spread */

const Tour = require('../models/tourModel');

// 2) ROUTE HANDLERS = CONTROLLERS

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
  // const tour = tours.find((el) => el.id === Number(tourId));
  // return res.status(200).json({ status: 'success', data: { tour } });
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    return res.status(201).json({ status: 'success', data: { tour: newTour } });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
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
};
