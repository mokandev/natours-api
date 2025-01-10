const express = require('express');
const tourController = require('../controllers/tourController');
// Destructuring
// const {
//   getAllTours,
//   createTour,
//   getTourById,
//   updateTour,
//   deleteTour,
// } = require('../controllers/tourController');

const router = express.Router();

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
