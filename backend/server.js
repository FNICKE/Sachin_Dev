const app = require('./src/app');
const { startKeepAlive } = require('./src/utils/keepAlive');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  startKeepAlive();
});
