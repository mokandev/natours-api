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
    return res.status(404).json({ status: 'fail', message: error.message });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    return res.status(201).json({ status: 'success', data: { tour: newTour } });
  } catch (error) {
    res.status(404).json({
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
    return res.status(404).json({ status: 'fail', message: error.message });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    return res.status(204).json({ status: 'success' });
  } catch (error) {
    return res.status(404).json({ status: 'fail', message: error.message });
  }
};

const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          // _id: '$ratingsAverage',
          num: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } },
      // }
    ]);
    return res.status(201).json({ status: 'success', data: { stats } });
  } catch (error) {
    return res.status(404).json({ status: 'fail', message: error.message });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: { startDates: { $gte: new Date(`${year}-01-01`), $lte:new Date(`${year}-12-31`) } },
      },
      {
        $group: { _id: { $month: '$startDates' }, numTourStarts: { $sum: 1 }, tours: { $push: '$name' } },
      },
      {
        $addFields: { month: { $toString: '$_id' } },
      },
      {
        $project: { _id: 0 }
      },
      { 
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }
    ]);

    return res.status(201).json({ status: 'success', data: { plan } });
  } catch (error) {
    return res.status(404).json({ status: 'fail', message: error.message });
  }
};

module.exports = {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
