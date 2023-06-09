const db = require('../models');
const { Op } = require('sequelize');
const {paginate} = require('../helper')

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
        include: {
            model: db.User,
            where: {}
        }
    };
    if (name)
        options.include.where.name = {
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
                let {teacherID, ...rest} = t_info.dataValues
                let {User, ...teacher_info} = rest
                let {password, ...user_info} = User.dataValues
                results.push({...user_info, ...teacher_info})
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

const infoTeacher = async (req, res) => {
    try {
        const userID = req.params.id
        const user = await db.User.findOne({id: userID})
        let {password, ...info} = user.dataValues
        const teacher = await db.Teacher.findOne({where:{teacherID: userID}})
        let {teacherID, ...teacher_info} = teacher.dataValues
        const result = {...info, ...teacher_info}
        return res.status(200).json({data: result})
    } catch (err){
        return res.status(400).json({success: false, message: "Can't get teacher information"});
    }
}

const postTeacher = async (req, res) => {
    const { userID } = req
    try {
        const update = {};
        const keys = Object.keys(req.body)
        for (const key of keys){
            if (req.body[key] !== '') {
                update[key] = req.body[key];
            }
        }
        const teacher = await db.Teacher.findOne({where:{teacherID: userID}})
        await teacher.update(update)
        await teacher.save({ fields: keys });
        const result = await teacher.reload();
        return res.status(200).json({data: result, message: "Update teacher information"})
    } catch (err){
        req.body.teacherID = userID
        const result = await db.Teacher.create(req.body)
        return res.status(200).json({data: result, message: "Create new teacher information"})
    }
}

module.exports = {
    searchTeacher,
    infoTeacher,
    postTeacher
}