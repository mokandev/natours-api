const app = require('./app');

// 4) START SERVER
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
