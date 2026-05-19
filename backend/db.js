const Database = require("better-sqlite3");

const db = new Database("../database/cafe.db");

module.exports = db;