const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { User } = require('../models/userModel');
const { successResponse } = require('./responseController');
const { default: mongoose } = require('mongoose');
const {findWithId } = require('../services/finditem');
const { deleteImage } = require('../helper/deleteImage');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const { jwtActivationKey, clentURL } = require('../secret');
const { emailWithNodeMailer } = require('../helper/email');

const getUsers = async(req, res, next)=>{
try {
    const search = req.query.search || '';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

   const searchRegExp = new RegExp('.*' + search + '.*','i');

   const filter = {
    isAdmin:{$ne: true},
    $or:[
        {name: {$regex: searchRegExp}},
        {email: {$regex: searchRegExp}},
        {phone: {$regex: searchRegExp}},
    ]
   }
   const options = {password: 0}

   const users = await User.find(filter, options)
   .limit(limit)
   .skip((page-1) * limit)

   const count = await User.find(filter).countDocuments()

   if(!users) throw createError(404, "No Users Found")

//    res.status(200).send({
//     message: "users were returnd",
//     users,
//     pagination:{
//         totalPages: Math.ceil(count / limit),
//         currentPage: page,
//         previousPage: page-1 > 0 ? page-1 :null,
//         nextPage: page+1 <= Math.ceil(count / limit) ? page+1 :null,
//     }
//    })

   return successResponse(res, {
    statusCode: 200,
    message: "Users were Returned Successfully",
    payload:{
        users,
        pagination:{
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page-1 > 0 ? page-1 :null,
            nextPage: page+1 <= Math.ceil(count / limit) ? page+1 :null,
        },
    },
   })
} catch (error) {
    next(error)
}
}
const getUserById = async(req, res, next)=>{
    try {
       const id = req.params.id;
       const options = {password:0};
       const user = await findWithId(User, id, options);
    //    const options = {password:0};
    //    const user = await User.findById(id, options);
    //    if(!user){
    //     throw createError(404, "User does not Exist with This Id");
    //    }
       return successResponse(res, {
        statusCode: 200,
        message: "User were Returned Successfully",
        payload:{user},
       })
    } catch (error) {
        // if(error instanceof mongoose.Error){
        //     next(createError(400, "Invalid User Id"))
        //     return;
        // }
        next(error)
    }
    }

const deleteUserById = async(req, res, next)=>{
        try {
           const id = req.params.id;
           const options = {password:0};
           const user = await findWithId(User, id, options);

           const userImagePath = user.image;
            deleteImage(userImagePath);

        //    fs.access(userImagePath, (err)=>{
        //      if(err){
        //         console.error("User Image does not Exist")
        //      }else{
        //          fs.unlink(userImagePath, (err)=>{
        //             if(err) throw err;
        //             console.log("User Image was Deleted")
        //          })
        //      }
        //    })

          await User.findByIdAndDelete({
            _id: id,
            isAdmin: false,
           })
           return successResponse(res, {
            statusCode: 200,
            message: "User was Deleted Successfully",
            payload:{user},
           })
        } catch (error) {
            next(error)
        }
        }

const processRegister = async(req, res, next)=>{
            try {
            const {name, email, password, phone, address} = req.body;
             
            const image = req.file;
            if (!image) {
                throw createError(400, 'Image file is required')
            }

            if (image.size > 1024*1024*2) {
                throw createError(400, 'file to large. It must be less than 2MB')
            }
            const imageBufferString = image.buffer.toString('base64')

            const userExists = await User.exists({email: email})
            if(userExists){
                throw createError(409, "Email Already Exist, Please Login ");
            }

            //create JWT
              const token = createJSONWebToken(
                {name, email, password, phone, address, image:imageBufferString},
                 jwtActivationKey, '10m')
            // const newUser ={
            //     name,
            //     email,
            //     password,
            //     phone,
            //     address,
            // }

            // Prepare email
            const emailData = {
                email,
                subject: 'Account Activation  Email',
                html:`
                <h2>Hello ${name}!</h2>
                <p> Please click here to <a href="${clentURL}/users/activate/${token}"
            target="_blank"> activate your account </a></p>}`
            }

            //send email with nodemailer
           try {
            await emailWithNodeMailer(emailData);  
           } catch (emailError) {
            next(createError(500, 'Failed to send verification email'))
            return;
           } 

               return successResponse(res, {
                statusCode: 200,
                message: `Please go to your ${email} for completing your registration process`,
                payload:{token},
               })
            } catch (error) {
                next(error)
            }
            }

 const activateUserAccount = async(req, res, next)=>{
             try{
                const token = req.body.token;
                if(!token) throw createError(404, 'Token not Found');
                try {
                    const decoded = jwt.verify(token, jwtActivationKey);
                    // console.log(decoded)
                    if(!decoded) throw createError(401, 'Unable to verify User');

                    const userExists = await User.exists({email: decoded.email})
                    if(userExists){
                        throw createError(409, "Email Already Exist, Please Login ");
                    }

                    await User.create(decoded);

                       return successResponse(res, {
                        statusCode: 201,
                        message:'User was Registered Successfully',
                       })
                } catch (error) {
                    if(error.name == 'TokenExpiredError'){
                        throw createError(401, 'Token has Expired')
                    }else if (error.name == 'JsonWebTokenError'){
                        throw createError(401, 'Invalid Token')
                    }else{
                        throw error;
                    }
                }

                } catch (error) {
                    next(error)
                }
            }
                           
 const updateUserById = async(req, res, next)=>{
                try {
                   const userId = req.params.id;
                   const options = {password:0};
                   await findWithId(User, userId, options);
                   const updateOptions = {new : true, runValidators:true, context: 'query'};
                   let updates = {}
                //    if (req.body.name) {
                //     updates.name = req.body.name; 
                //    }
                //    if (req.body.password) {
                //     updates.password = req.body.password; 
                //    }
                //    if (req.body.phone) {
                //     updates.phone = req.body.phone; 
                //    }
                //    if (req.body.address) {
                //     updates.address = req.body.address; 
                //    }
                   for(let key in req.body){
                    if (['name', 'password', 'phone', 'address'].includes(key)) {
                        updates[key] = req.body[key];
                    }

                    else if (['email'].includes(key)) {
                        throw new Error('Email can not be Updated');
                    }
                   }

                   const image = req.file;
                   if (image) {
                    if (image.size > 1024*1024*2) {
                        throw createError(400, 'file to large. It must be less than 2MB')
                    }
                    updates.image = image.buffer.toString('base64')
                   }
                   const updateUser = await User.findByIdAndUpdate(userId, updates, updateOptions).select("-password");
                   if (!updateUser) {
                    throw createError(404, "User with this ID does not Exist");
                   }
                   return successResponse(res, {
                    statusCode: 200,
                    message: "User was Updated Successfully",
                    payload:updates,
                   })
                } catch (error) {
                    next(error)
                }
                }

module.exports = {getUsers, getUserById, deleteUserById, processRegister, activateUserAccount, updateUserById};