const db = require('../models');

const infoTeacher = async (req, res) => {
    try {
        const userID = req.params.id
        const user = await db.User.findOne({where:{id: userID}})
        let {password, ...info} = user.dataValues
        const teacher = await db.Teacher.findOne({where:{teacherID: userID}})
        let {teacherID, ...teacher_info} = teacher.dataValues
        const result = {...info, ...teacher_info}
        return res.status(200).json({data: result})
    } catch (err){
        return res.status(400).json({success: false, message: "Can't get teacher information"});
    }
}

const StudentList = async (req, res) => {
    const {userID} = req
    const page = req.query.page || 1
    const limit = req.query.limit || 16
    db.Matching.findAndCountAll({
        where: {teacherID: userID},
        include: {
            model: db.User
        },
        ...paginate(page, limit)
    }).then(({count, rows}) => {
        let results = []
        rows.forEach((info) => {
            let {teacherID, studentID, ...rest} = info.dataValues
            let {User, ...content} = rest
            let {password, ...user_info} = User.dataValues
            results.push({...user_info, ...content})
        })
        let totalPages = Math.ceil(count/limit)
        
        let message = ''
        if (count > 1) message = `Finded ${count} students`
        else message = `Finded ${count} student`
        
        return res.status(200).json({
            data: results,
            infoPage: {
                totalPages,
                currentPage: page,
                pageSize: limit
            },
            message
        });
    }).catch(() => {
        return res.status(400).json({success: false, message: "No comment available"});
    })
}

const postTeacher = async (req, res) => {
    const { userID } = req
    try {
        const t_update = {};
        const t_keys = Object.keys(req.body.teacher)
        for (const key of t_keys){
            if (req.body[key] !== '') {
                t_update[key] = req.body.teacher[key];
            }
        }
        const teacher = await db.Teacher.findOne({where:{teacherID: userID}})
        await teacher.update(t_update)
        await teacher.save({ fields: t_keys });
        const t_result = await teacher.reload();
        if (req?.body?.schedulers){
            let sch_result = []
            await db.Scheduler.destroy({where: {teacherID: userID}, force: true})
            schedulers.map(async (value) => {
                let newsch = await db.Scheduler.create(value)
                sch_result.push(newsch.dataValues)
            })
        } else {
            return res.status(200).json({data: {teacher: t_result.dataValues}, message: "Update teacher information"})
        }
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
    updateMatch,
    StudentList
}