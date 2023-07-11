require("dotenv").config()
const db = require('../models');
const { Op } = require('sequelize');
const { paginate, transporter } = require('../helper');
const jwt = require("jsonwebtoken");
const OTP = require('otp-generator')

const getUser = async (req, res) => {
    try {
        const { userID } = req;
        const user = await db.User.findOne({where:{id: userID}});
        const {password, ...user_info} = user.dataValues
        let result = user_info
        return res.status(200).json({data: result})
    } catch (err) {
        return res.status(400).json({success:false, message: "Can't get user information" });
    }
};

const postUser = async (req, res) => {
    try {
        const { userID } = req
        const update = {};
        const keys = Object.keys(req.body)
        for (const key of keys){
            if (key == 'role'){
                throw "Can't change this attributes"
            }
            if (req.body[key] !== '') {
                update[key] = req.body[key];
            }
        }
        const user = await db.User.findOne({where:{id: userID}})
        await user.update(update)
        await user.save({ fields: keys });
        const result = await user.reload();
        return res.status(200).json({data: result})
    } catch (err) {
        return res.status(400).json({success: false, message: "Can't update user information"});
    }      
};

const getMatch = async (req, res) => {
    const {userID} = req
    const page = req.query.page || 1
    const limit = req.query.limit || 16
    const user = await db.User.findOne({where: {id: userID}})
    if (user.role == 'teacher') {
        db.Matching.findAndCountAll({
            where: {teacherID: userID},
            include: {
                model: db.User
            },
            order: [['createdAt', 'DESC']],
            ...paginate(page, limit)
        }).then(({count, rows}) => {
            let results = []
            rows.forEach((info) => {
                let {teacherID, userID, ...rest} = info.dataValues
                let {User, ...content} = rest
                let {id, password, ...user_info} = User.dataValues
                results.push({...user_info, ...content})
            })
            let totalPages = Math.ceil(count/limit)   
            return res.status(200).json({
                data: results,
                infoPage: {
                    totalPages,
                    currentPage: page,
                    pageSize: limit
                },
            });
        }).catch(() => {
            return res.status(400).json({success: false, message: "No match available"});
        })
    } else {
        db.Matching.findAndCountAll({
            where: {userID: userID},
            include: {
                model: db.Teacher,
                include: {
                    model: db.User
                }
            },
            ...paginate(page, limit)
        }).then(({count, rows}) => {
            let results = []
            rows.forEach((info) => {
                let {teacherID, userID, ...rest} = info.dataValues
                let {Teacher, ...content} = rest
                let {User, ...teacher_info} = Teacher.dataValues
                let {id, password, ...user_info} = User.dataValues
                results.push({...user_info, ...teacher_info, ...content})
            })
            let totalPages = Math.ceil(count/limit)
            let infoPage = {
                totalPages,
                currentPage: page,
                pageSize: limit
            }
            return res.status(200).json({
                data: results,
                infoPage
            });
        })
        .catch(() => {
            return res.status(400).json({success: false, message: "No match available"});
        })
    }
}

const requestMatch = async (req, res) => {
    try {
        const userID = req.userID
        const {teacherID, info} = req.body
        const user = await db.User.findOne({where: {id: userID}})
        if (userID != teacherID && user.role == 'student') {
            const result = await db.Matching.create({
                userID,
                teacherID,
                info
            })
            return res.status(200).json({data: result, message: "Created new request"})
        } else {
            return res.status(400).json({success: false, message: "Can't request yourself"});
        }
    } catch {
        return res.status(400).json({success: false, message: "Can't update user information"});
    }
}

const infoMatch = async (req, res) => {
    try {
        const userID = req.userID
        const teacherID = req.params.id
        const result = await db.Matching.findOne({where: {userID: userID, teacherID: teacherID}})
        return res.status(200).json({data: result, message: "Your request has been sent to the tutor"})
    } catch {
        return res.status(400).json({success: false, message: "Can't update user information"});
    }
}

const searchTeacher = async (req, res) => {
    const filters = req.query
    const currentPage = filters.page || 1
    const pageSize = filters.limit || 3
    const name = filters.name
    const low_age = filters.low_age
    const high_age = filters.high_age
    const level = filters.level
    const experience = filters.experience
    const gender = filters.gender
    const low_price = filters.low_price
    const high_price = filters.high_price
    const teach_method = filters.teach_method
    const shift = filters.shift
    const days = filters.days
    console.log(shift, days)
    const options = { 
        where: {},
        include: [
            {model: db.User,where: {}},
            {model: db.Scheduler,where: {}},
        ],
        distinct: true
    };
    if (name)
        options.include[0].where.name = {
            [Op.regexp]: `(?i)^.*${name}.*$`
        }

    if (low_age && high_age)
        options.where.age = {
            [Op.and]:{
                [Op.gte]: low_age, 
                [Op.lte]: high_age
            }
        }
    if (level)
        options.where.level = level
    if (experience)
        options.where.experience = experience
    if (gender)
        options.include[0].where.gender = gender
    if (low_price && high_price)
        options.where.price = {
            [Op.and]:{
                [Op.gte]: low_price, 
                [Op.lte]: high_price
            }
        }
    if (teach_method)
        options.where[Op.and] = {
            [Op.or]:{
                teach_method1: {
                    [Op.regexp]: `(?i)${teach_method}`
                },
                teach_method2: {
                    [Op.regexp]: `(?i)${teach_method}`
                },
                teach_method3: {
                    [Op.regexp]: `(?i)${teach_method}`
                }
            }
        } 
    if (shift && days)
        options.include[1].where = {
            [Op.and]: {
                shiftID: shift,
                weekdayID: {
                    [Op.in]: days
                }
            }
        }
    const {offset, limit} = paginate(currentPage, pageSize)

    db.Teacher.findAndCountAll({
        ...options,
        order: [['createdAt', 'DESC']],
        offset,
        limit,
        distinct: true
    }).then(({count, rows}) => {
        let results = []
        const totalPages = Math.ceil(count/limit);
        rows.forEach((t_info) => {
            let schedulers = []
            let {User, ...rest} = t_info.dataValues
            let {password, ...user_info} = User.dataValues
            let {Schedulers, ...teacher_info} = rest
            Schedulers.forEach((value) => {
                schedulers.push(value.dataValues)
            })
            results.push({...user_info, ...teacher_info, schedulers})
        })            

        let message = ''
        if (count > 1) message = `Finded ${count} results`
        else message = `Finded ${count} result`
        
        return res.status(200).json({
            data: results, 
            infoPage: {
                totalPages,
                currentPage,
                pageSize
            },
            message
        })
    })
    .catch(() => {
        return res.status(400).json({success: false, message: "No teacher available"});
    })
}

const sendOtp = async (req, res) => {
    try {
        const {email} = req.body
        const user = await db.User.findOne({where: {email: email}})
        let otp = OTP.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        })
        let jwt_otp = jwt.sign({otp: otp}, process.env.OTP_SECRET, {
            expiresIn: process.env.OTP_TIMEOUT
        })
        await user.update({otp: jwt_otp})
        await user.save({fields: ['otp']})
        
        var mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Sagasuy Email',
            text: `Your OTP password ${otp}`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        return res.status(200).json({data: email}) 
    } catch {
        return res.status(400).json({success: false, message: "Error"}) 
    }
}

const checkOtp = async (req, res) => {
    try {
        const {email, otp} = req.body
        const user = await db.User.findOne({where: {email: email}})
        const decoded = jwt.verify(user.otp, process.env.OTP_SECRET); 
        if (otp === decoded.otp){
            let token = jwt.sign({id: user.id}, process.env.OTP_SECRET, {
                expiresIn: process.env.OTP_TIMEOUT
            })
            return res.status(200).json({data: {
                pass_token: token
            }})
        } else {
            return res.status(400).json({success: false, message: "Error"}) 
        }
    } catch {
        return res.status(400).json({success: false, message: "Error"}) 
    }
}

const changePass = async (req, res) => {
    try {
        const {email, password, pass_token} = req.body
        const decoded = jwt.verify(pass_token, process.env.OTP_SECRET); 
        const user = await db.User.findOne({where: {email: email}})
        if (user.id == decoded.id) {
            await user.update({password: password})
            await user.save({ fields: ['password'] });
            const {password, ...result} = await user.reload();
            return res.status(200).json({data: result})
        } else {
            return res.status(400).json({success: false, message: "Error"}) 
        }
    } catch {
        return res.status(400).json({success: false, message: "Error"})
    }
}

module.exports = {
    getUser,
    postUser,
    searchTeacher,
    requestMatch,
    infoMatch,
    getMatch,
    sendOtp,
    checkOtp,
    changePass
}