require("dotenv").config()
const db = require('../models');
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    const { email } = req.body;
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
        res.cookie('x-auth-token', token, {httpOnly: true})
        if (!user) {
            return res.status(400).json({success: false, message:"User not found"});
        }
        if (!(user.validPassword(password))) {
            return res.status(400).json({success: false, message:"Invalid password"});
        }
        return res.status(200).json({message: "Login Success"});
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

const getUser = async (req, res) => {
    try {
        const { userId } = req;
        const user = await db.User.findOne({id: userId});
        try {
            if (user.role == 'teacher') {
                const teacher = await db.Teacher.findOne({teacherID: userId});
                let {teacherID, ...info} = teacher.dataValues
                result = {...user.dataValues, ...info}
            }
        } catch {
            result = user.dataValues
        }
        return res.status(200).json({data: result})
    } catch (err) {
        return res.status(400).json({success:false, message: "Can't get user information" });
    }
};

const postUser = async (req, res) => {
    try {
        const { userId } = req
        const update = {};
        const keys = Object.keys(req.body)
        for (const key of keys){
            if (req.body[key] !== '') {
                update[key] = req.body[key];
            }
        }
        const user = await db.User.findOne({id: userId})
        await user.update(update)
        await user.save({ fields: keys });
        const result = await user.reload();
        return res.status(200).json({data: result})
    } catch (err) {
        return res.status(400).json({success: false, message: "Can't update user information"});
    }      
};

const requestMatch = async (req, res) => {
    try {
        const studentId = req.userId
        const {teacherId, info} = req.body
        //TODO
        const data = null
        return res.status(200).json({data: result})
    } catch {
        return res.status(400).json({success: false, message: "Can't update user information"});
    }
}

module.exports = {
    login, 
    signup,
    logout,
    getUser,
    postUser,
    requestMatch
}