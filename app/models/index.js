const dbConfig = require('../config/db.config');
const mongoose = require('mongoose');

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.user = require('./users.model')(mongoose);
db.role = require('./roles.model')(mongoose);

module.exports = db;

