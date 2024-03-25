const {body} = require('express-validator');

//Registration Validator
const validateUserRegistration =[
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is Required. Enter your Name')
    .isLength({min: 3, max: 31})
    .withMessage('Name should be at last 3-31 Characters long'),

    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is Required. Enter your Email')
    .isEmail()
    .withMessage('Invalid Email Address'),

    body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is Required')
    .isLength({min: 6})
    .withMessage('Password should be at least 6 characters long')
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
     .withMessage('Password should contain at least one uppercase letter, one lowercase letter, one number and one special character'),   

    body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is Required')
    .isLength({min: 3})
    .withMessage('Address should be at least 3 characters long'),

    body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is Required'),
     
    body('image')
     .custom((value, {req})=>{
        if(!req.file || !req.file.buffer){
            throw new Error('User Image is Required');
        }
        return true;
     })
     .withMessage('User Image is Required'),
    

];


module.exports = {validateUserRegistration};
