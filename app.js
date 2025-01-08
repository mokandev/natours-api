const express = require('express');

const app = express();

const PORT = 8000;

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello From the Server', app: 'Natours' });
});


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
