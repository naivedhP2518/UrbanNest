const mongoose = require('mongoose');

// Create connection objects synchronously so models can bind to them immediately
const adminDB = mongoose.createConnection();
const dataDB = mongoose.createConnection();

// Connect sequentially to prevent DNS querySrv EREFUSED errors on concurrent initializations
adminDB.openUri(process.env.MONGO_URI_ADMIN)
  .then(() => {
    return dataDB.openUri(process.env.MONGO_URI_DATA);
  })
  .catch((err) => {
    console.error(`Database Initialization Error:`, err);
  });

adminDB.on('connected', () => {
  console.log(`Admin DB Connected`);
});

adminDB.on('error', (err) => {
  console.error(`Admin DB Connection Error: ${err.message}`);
});

dataDB.on('connected', () => {
  console.log(`Data DB Connected`);
});

dataDB.on('error', (err) => {
  console.error(`Data DB Connection Error: ${err.message}`);
});

module.exports = { adminDB, dataDB };
