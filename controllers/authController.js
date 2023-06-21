require('dotenv').config('../.env')
const db = require('../models');
const jwt = require("jsonwebtoken");
const ms = require("ms")
const signup = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await db.User.findOne({where:{email: email}})
        if (user) 
        {
            return res.status(400).json({success: false, message: "User already exists"});
        }
        const result = await db.User.create(req.body);
        const {password, ...user_info} = result.dataValues
        return  res.status(200).json({data: user_info, message: "Created user successfully"})
    } catch (err) {
        return res.status(400).json({success: false, message: "Information is missing"});
    }
};

const login = async (req, res) => {
    try {
        const user = await db.User.findOne({where:{email: req.body.email}})
        if (!user) {
            return res.status(400).json({success: false, message:"User not found"});
        }
        if (!(user.validPassword(req.body.password))) {
            return res.status(400).json({success: false, message:"Invalid password"});
        }
        let token = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.JWT_TIMEOUT
        })
        let timeout = ms(process.env.JWT_TIMEOUT)
        let {password, ...user_info} = user.dataValues 
        return res.status(200).json({
            data: {
                user: user_info,
                access_token: token, 
                timeout
            },
            message: `Welcome ${user.name}`
        });
    } catch (err) {
        return res.status(400).json({success: false, message: "User authentication failed"});
    }
};

const logout = async (req, res) => {
    try {
        const id = req.userID
        const user = await db.User.findOne({where:{id: id}})
        return res.status(200).json({message: `Good bye ${user.name}`});
    } catch (err) {
        return res.status(400).json({success: false, message: "User authentication failed" });
    }
};

module.exports = {
    login, 
    signup,
    logout
}