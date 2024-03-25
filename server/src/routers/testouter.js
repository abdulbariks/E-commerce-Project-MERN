const express = require('express');
const { testUsers } = require('../controllers/testController');
const testRouter = express.Router();



testRouter.get("/",testUsers);

module.exports ={testRouter}