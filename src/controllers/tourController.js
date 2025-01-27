/* eslint-disable prefer-object-spread */

const Tour = require('../models/tourModel');

// 2) ROUTE HANDLERS = CONTROLLERS

const getAllTours = async (req, res) => {
  try {
    // 1A) Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // { difficulty: "easy", duration: { $gte: 5 }}
    // req.query { difficulty: "easy", durationg: { gte: '5' } }
    // gte, gt, lte, lt

    // 2) Sorting

    // BUILD QUERY
    let query = Tour.find(JSON.parse(queryStr));

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      // sort("price ratingsAverage")
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Fields Limiting

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4) Pagination

    const page = req.query.page * 1 || 1;

    const limit = req.query.limit * 1 || 100;

    const skip = (page - 1) * limit;

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exists');
    }

    // limit=10&page=2  , 1-10 page 1 , 11-20 page2, 21-30 page3
    query = query.skip(skip).limit(limit);

    // EXECUTE QUERY
    const tours = await query;

    // CHANINING METHODS TO THE QUERY
    // const query = Tour.find().where('duration').equals(5).where('difficulty').equals('easy')

    // SEND RESPONSE
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
};
