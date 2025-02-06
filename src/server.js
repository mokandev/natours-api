const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB Connection Successful');
  });

const app = require('./app');

const PORT = process.env.PORT || 3000;

// 4) START SERVER
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);

  console.log('UNHANDLED REJECTIONS! Shutting down...');

  server.close(() => {
    process.exit(1);
  });
});
