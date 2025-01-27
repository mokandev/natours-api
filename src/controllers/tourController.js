const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

// 2) ROUTE HANDLERS = CONTROLLERS

const aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage,';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};


const getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
      
    const tours = await features.query;

    return res
      .status(200)
      .json({ status: 'success', data: { tours, results: tours.length } });
  } catch (error) {
    return res.status(404).json({ status: 'fail', message: error.message });
  }
};

const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})
    return res.status(200).json({ status: 'success', data: { tour } });
  } catch (error) {
    return res.status(400).json({ status: 'fail', message: error.message });
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

const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res
      .status(200)
      .json({ status: 'success', data: { tour: updatedTour } });
  } catch (error) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    return res.status(204).json({ status: 'success' });
  } catch (error) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

module.exports = {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
};
