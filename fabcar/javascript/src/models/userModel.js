const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userScema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
        
    }],
    role:{
        type: String,
        default: 'client'
    }

})

///statics are available on models & methods are available on instances 

userScema.statics.findbyCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) throw new Error('Unable to log in');


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Unable to login');
    return user;
}   


userScema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'tax-code', { expiresIn: 86400 })
    user.tokens = user.tokens.concat({ token })
    await user.save();
    console.log(token);
    return token;

}


userScema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    //console.log(userObject);
    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}


//here we need normal function as arrow function dont bind this

userScema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next()
})





const User = mongoose.model('User', userScema);
module.exports = User;