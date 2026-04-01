const mongoose = require('mongoose');

const adminDB = mongoose.createConnection(process.env.MONGO_URI_ADMIN);

adminDB.on('connected', () => {
  console.log(`Admin DB Connected`);
});

adminDB.on('error', (err) => {
  console.error(`Admin DB Connection Error: ${err.message}`);
});

const dataDB = mongoose.createConnection(process.env.MONGO_URI_DATA);

dataDB.on('connected', () => {
  console.log(`Data DB Connected`);
});

dataDB.on('error', (err) => {
  console.error(`Data DB Connection Error: ${err.message}`);
});

module.exports = { adminDB, dataDB };
