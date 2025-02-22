// 2) ROUTE HANDLERS = CONTROLLERS

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj = { ...newObj, [el]: obj[el] };
    }
  });
  return newObj;
};

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  return res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create an error if users POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword route.',
        400,
      ),
    );
  }

  // 2) Filtered out unwanted body fields that are not allowd to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 2) Update the user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

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

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  updateMe,
};
