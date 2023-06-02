const db = require('../models');
const { Op } = require('sequelize');

const filterTeacher = async (req, res) => {
    const filters = req.query
    let name = filters.name
    let low_age = filters.low_age
    let high_age = filters.high_age
    let level = filters.level
    let experience = filters.experience
    let sex = filters.sex
    let low_price = filters.low_price
    let high_price = filters.high_price
    let options = { 
        where: {},
        include: {
            model: db.User
        },
    };

    if (name)
        options.where.name = {
            [Op.iLike]: `%${name}%` 
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
    if (sex)
        options.where.sex = sex
    if (low_price && high_price)
        options.where.price = {
            [Op.and]:{
                [Op.gte]: low_price, 
                [Op.lte]: high_price
            }
        }
    
    db.Teacher.findAll(options)
        .then(async (t_infos) => {
            let results = []
            t_infos.forEach((t_info) => {
                let {teacherID, ...rest} = t_info.dataValues
                let {User, ...teacher_info} = rest
                let {password, ...user_info} = User.dataValues
                results.push({...user_info, ...teacher_info})
            })
            return res.status(200).json({data: results})
        })
        .catch(() => {
            return res.status(400).json({success: false, message: "No teacher available"});
        })
}

const infoTeacher = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await db.User.findOne({id: userId})
        let {password, ...info} = user.dataValues
        const teacher = await db.Teacher.findOne({teacherID: userId})
        let {teacherID, ...teacher_info} = teacher.dataValues
        const result = {...info, ...teacher_info}
        //TODO
        //also return all comment of that teacher
        return res.status(200).json({data: result})
    } catch (err){
        return res.status(400).json({success: false, message: "Can't get teacher information"});
    }
}

const postTeacher = async (req, res) => {
    const { userId } = req
    try {
        const update = {};
        const keys = Object.keys(req.body)
        for (const key of keys){
            if (req.body[key] !== '') {
                update[key] = req.body[key];
            }
        }
        const teacher = await db.Teacher.findOne({teacherID: userId})
        await teacher.update(update)
        await teacher.save({ fields: keys });
        const result = await teacher.reload();
        return res.status(200).json({data: result, message: "Update teacher information"})
    } catch (err){
        req.body.teacherID = userId
        const result = await db.Teacher.create(req.body)
        return res.status(200).json({data: result, message: "Create new teacher information"})
    }
}

module.exports = {
    filterTeacher,
    infoTeacher,
    postTeacher
}