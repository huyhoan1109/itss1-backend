const db = require('../models');

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

const updateMatch = async(req, res) => {
    const { userID } = req
    try {
        const match_id = req.body.match_id
        const status = req.body.status
        // status : "wait", "refuse", "agree"
        if (status == 'wait'){
            const match = await db.Matching.findOne({where:{id: match_id}})
            await match.update({status: status})
            await match.save({ fields: ['status'] });
            const result = await match.reload();
            return res.status(200).json({data: result, message: "Update matching request"})
        } else {
            return res.status(400).json({success: false, message: "You can't change this status any more"})
        }
    } catch (err){
        req.body.teacherID = userID
        const result = await db.Teacher.create(req.body)
        return res.status(200).json({data: result, message: "Create new teacher information"})
    }
}

module.exports = {
    infoTeacher,
    postTeacher,
    updateMatch
}