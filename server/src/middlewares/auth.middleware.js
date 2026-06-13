const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function authUser(req, res){
    const token = req.cookies.token;

    if(!token){
        return res.status(404).json({
            message: "Invalid token"
        })
    }

    try{
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(err){
        return res.status(404).json({
            message: "Invalid token"
        })
    }
}

module.exports = authUser;