const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const cookieParser = require('cookie-parser')

const bodyParser = require('body-parser');

const auth = async (req, res, next) => {
    try { 
        const token = req.cookies.auth
        const decoded = jwt.verify(token, 'tax-code');
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token })
        if (!user) { throw new Error(); }
        req.user = user;
        console.log(user);
        next();

    } catch (e) {
        res.status(401).send({error: 'please authenticate',e})
    }

}



module.exports = auth;