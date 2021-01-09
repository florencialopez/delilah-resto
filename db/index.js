const { dbName, dbPath } = require("./sequelize/config"); //traigo conexion a base de datos
const  Sequelize = require('sequelize');

const db = new Sequelize(dbPath); //conexion a db
module.exports = { dbName, db }; //exporto db y conexion