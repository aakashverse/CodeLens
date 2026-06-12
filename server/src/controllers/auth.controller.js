const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function registerController(req, res) {
    const {username, email, password, role} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            message: "Insufficient Credentials"
        })
    }

    const isAlreadyExists = await userModel.findOne({
        $or: [{username}, {email}]
    });

    if(isAlreadyExists){
        return res.status(400).json({
            message: "User Already Exists, try Login"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
        username,
        email,
        password: hashedPassword,
        role
    });

    return res.status(201).json({
        message: "User Registered Successfully",
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        }
    })

}

async function loginController(req, res) {
    const {username, email, password} = req.body;

    const user = userModel.findOne({email});

    if(!user){
        return res.status(400).json({
            message: "Invalid Email or Password",
        })
    }
    
    const decoded = await bcrypt.compare(password, user.password);
    if(!decoded){
        return res.status(400).json({
            message: "Invalid Email or Password",
        })
    }

    return res.status(200).json({
        message: "login successfull",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = {registerController, loginController}