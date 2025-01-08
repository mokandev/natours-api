const fs = require('fs');
const express = require('express');

const app = express();

const PORT = 8000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
