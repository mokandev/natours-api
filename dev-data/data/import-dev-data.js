const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../src/models/tourModel');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB Connection Successful');
  });

// READ JSON FILE
const toursRaw = fs.readFileSync(`${__dirname}/tours.json`, 'utf-8');
const tours = JSON.parse(toursRaw);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Successfully loaded');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// DELETE ALL DATA FROM COLLECTION
const deleteAllData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Successfully deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
}
if (process.argv[2] === '--delete') {
  deleteAllData();
}

console.log(process.argv);
