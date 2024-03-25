const {Schema, model} = require("mongoose");
const bcrypt = require('bcryptjs');
const { defaultImagePath } = require("../secret");

const userSchema = new Schema({
         name: {
        type: String,
        required:[true, 'User Name is Required'],
        trim: true,
        minlength:[3, 'User name will be Mimimun 3 Characters'],
        maxlength:[35, 'User name will be Maximun 35 Characters']
    },
    email: {
        type: String,
        required:[true, 'User Email is Required'],
        trim: true,
        unique:true,
        validate:{
            validator: function(v){
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message:'Please enter a valid email'
        },
    },
    password: {
        type: String,
        required:[true, 'User Password is Required'],
        minlength:[3, 'User Password will be Mimimun 3 Characters'],
        set:(v) =>bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
        image: {
        // type: String,
        // default:defaultImagePath
        type : Buffer,
        contentType : String, 
        required:[true, 'User Image is Required'],
    },
    address: {
        type: String,
        required:[true, 'User Address is Required'],
        minlength: [3, 'The length of User address can be 3 charecters'],

    },
    phone: {
        type: String,
        required:[true, 'User Phone Number is Required'],

    },
    isAdmin: {
        type: Boolean,
        default: false

    },
    isBanned: {
        type: Boolean,
        default:false

    },
}, {timestamps:true});


const User = model('Users', userSchema);
module.exports = {User};


