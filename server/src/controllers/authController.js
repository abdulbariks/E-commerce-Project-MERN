const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { successResponse } = require('./responseController');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const { User } = require('../models/userModel');

const test = async(req, res, next)=>{
    try {
        const name =req.body;
        console.log(name)
        return successResponse(res, {
            statusCode: 200,
            message:'User Login Successfully',
            payload:{},
           })
    } catch (error) {
        next(error);
    }
}

const handleLogin = async(req, res, next)=>{
 try {
    const {name, password, email} = req.body;
    console.log(email);
    const user = await User.findOne({email: email})
    console.log(user);
    if (!user) {
        throw createError(404, 'User does not exist this email. Please register')
    }
    
    return successResponse(res, {
        statusCode: 200,
        message:'User Login Successfully',
        payload:{},
       })
    } catch (error) {
        next(error)
    }
}


module.exports ={handleLogin, test};