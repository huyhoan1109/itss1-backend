const db = require('../models');
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    const { email } = req.body;
    console.log(req.body)
    try {
        if (await db.User.findOne({email})) 
        {
            return res.status(400).json({success: false, message: "User already exists"});
        }
        const result = await db.User.create(req.body);
        return  res.status(200).json({data: result})
    } catch (err) {
        return res.status(400).json({success: false, message: "Information is missing"});
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.User.findOne({email});
        let token = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.JWT_TIMEOUT
        })
        if (!user) {
            return res.status(400).json({success: false, message:"User not found"});
        }
        if (!(user.validPassword(password))) {
            return res.status(400).json({success: false, message:"Invalid password"});
        }
        return res.status(200).json({access_token: token, message: "Login Success"});
    } catch (err) {
        return res.status(400).json({success: false, message: "User authentication failed"});
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('x-auth-token');
        return res.status(200).json({message: "Logout Success"});
    } catch (err) {
        return res.status(400).json({success: false, message: "User authentication failed" });
    }
};

module.exports = {
    login, 
    signup,
    logout
}