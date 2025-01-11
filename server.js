const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const PORT = process.env.PORT || 3000;

// 4) START SERVER
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
