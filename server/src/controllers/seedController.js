const data = require("../data");
const { User } = require("../models/userModel");

const seedUser = async(req, res, next)=>{
    try {  
        // deleting all existing users
        await User.deleteMany({});

        // inserting New Users
        const users = await User.insertMany(data.users)
        return res.status(201).json(users);
    } catch (error) {
        next(error)
    }


}
module.exports ={seedUser};