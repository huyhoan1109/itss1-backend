require("dotenv").config()
const jwt = require('jsonwebtoken')
const {promisify} = require('util')
const db = require('../models')

async function checkToken(req) {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN_SECRET);
    return decoded.id
}

async function authUser(req, res, next){
    checkToken(req)
        .then((id) => {
            req.userID = id
            return next()
        })
        .catch(() => {
            res.status(400).json({success:false, message: "Invalid token"})
        })
}

async function authTeacher(req, res, next){
    checkToken(req)
        .then(async (id) => {
            req.userID = id
            const user = await db.User.findOne({id})
            if (user.role == 'teacher') {
                return next()
            } else {
                return res.status(400).json({success:false, message: "You aren't an teacher"})
            }
        })
        .catch(() => {
            return res.status(400).json({success:false, message: "Invalid token"})
        })
}

async function authAdmin(req, res, next){
    checkToken(req)
        .then(async (id) => {
            req.userID = id
            const user = await db.User.findOne({id})
            if (user.role == 'admin') {
                return next()
            } else {
                return res.status(400).json({success:false, message: "You aren't an admin"})
            }
        })
        .catch(() => {
            return res.status(400).json({success:false, message: "Invalid token"})
        })
}

module.exports = {
    authUser,
    authTeacher,
    authAdmin
}