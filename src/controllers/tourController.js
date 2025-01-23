/* eslint-disable prefer-object-spread */

const Tour = require('../models/tourModel');

// 2) ROUTE HANDLERS = CONTROLLERS

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    return res
      .status(200)
      .json({ status: 'success', data: { tours, results: tours.length } });
  } catch (error) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})
    return res.status(200).json({ status: 'success', data: { tour } });
  } catch (error) {
    return res.status(404).json({ status: 'fail', message: 'Invalid tour ID' });
  }
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
