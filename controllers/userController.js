const db = require('../models');
const { Op, where } = require('sequelize');
const { paginate } = require('../helper');
const scheduler = require('../models/scheduler');

const getUser = async (req, res) => {
    try {
        const { userID } = req;
        console.log(userID)
        const user = await db.User.findOne({where:{id: userID}});
        const {password, ...user_info} = user.dataValues
        try {
            if (user.role == 'teacher') {
                const teacher = await db.Teacher.findOne({where:{teacherID: userID}});
                let {teacherID, ...teacher_info} = teacher.dataValues
                result = {...user_info, ...teacher_info}
            }
        } catch {
            result = user_info
        }
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
            if (key in ('role', 'email')){
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

const requestMatch = async (req, res) => {
    try {
        const studentId = req.userID
        const {teacherId, info} = req.body
        const result = db.Matching.create({
            studentId,
            teacherId,
            info
        })
        return res.status(200).json({data: result, message: "Created new request"})
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
        options.where.gender = gender
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
                }
            }
        } 

    const {offset, limit} = paginate(currentPage, pageSize)

    db.Teacher.findAndCountAll({...options, offset, limit})
        .then(async ({count, rows}) => {
            let results = []
            const totalPages = Math.ceil(count/limit);
            rows.forEach((t_info) => {
                let schedulers = []
                let {teacherID, ...t_rest} = t_info.dataValues
                let {User, ...rest} = t_rest
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

module.exports = {
    getUser,
    postUser,
    searchTeacher,
    requestMatch
}