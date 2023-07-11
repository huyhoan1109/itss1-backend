const db = require('../models');
const {paginate} = require('../helper')

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
            let {teacherID, userID, ...rest} = info.dataValues
            let {User, ...content} = rest
            let {id, password, ...user_info} = User.dataValues
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
        return res.status(400).json({success: false, message: "No match available"});
    })
}

const postTeacher = async (req, res) => {
    const { userID } = req
    const u_update = {};
    const u_keys = Object.keys(req.body.user_info)
    for (const key of u_keys){
        if (req.body.user_info[key] !== '') {
            u_update[key] = req.body.user_info[key];
        }
    }
    const user = await db.User.findOne({where:{id: userID}})
    await user.update(u_update)
    await user.save({ fields: u_keys });
    const u_result = await user.reload();
    
    try {
        const t_update = {};
        const t_keys = Object.keys(req.body.teacher_info)
        for (const key of t_keys){
            if (req.body.teacher_info[key] !== '') {
                t_update[key] = req.body.teacher_info[key];
            }
        }

        const teacher = await db.Teacher.findOne({where:{teacherID: userID}})
        await teacher.update(t_update)
        await teacher.save({ fields: t_keys });
        const t_result = await teacher.reload();

        const sum_stars = await db.Comment.sum('star', {where: {teacherID: userID}})
        const comments_length = await db.Comment.count({where: {teacherID: userID}})
        await teacher.update({star_average: comments_length > 0 ? sum_stars / comments_length : 0})
        await teacher.save({ fields: ['star_average'] });

        if (req?.body?.schedulers){
            let schedulers = req.body.schedulers
            let schs = []
            schedulers.map((shift) => {
                shift.value.forEach((weekdayID) => {
                    schs.push({teacherID: userID, shiftID: shift.shiftID, weekdayID: weekdayID})
                })
            })
            await db.Scheduler.destroy({where: {teacherID: userID}, force: true})
            await db.Scheduler.bulkCreate(schs)
            return res.status(200).json({data: {user_info: u_result, teacher_info: t_result.dataValues, schedulers}, message: "Update teacher information"})
        } else {
            return res.status(200).json({data: {user_info: u_result, teacher_info: t_result.dataValues}, message: "Update teacher information"})
        }
    } catch (err){
        req.body.teacher_info.teacherID = userID
        const t_result = await db.Teacher.create(req.body.teacher_info)
        if (req?.body?.schedulers){
            let schedulers = req.body.schedulers
            let schs = []
            schedulers.map((shift) => {
                shift.value.forEach((weekdayID) => {
                    schs.push({teacherID: userID, shiftID: shift.shiftID, weekdayID: weekdayID})
                })
            })
            await db.Scheduler.bulkCreate(schs)
            return res.status(200).json({data: {user_info: u_result, teacher_info: t_result.dataValues, schedulers}, message: "Update teacher information"})
        } else {
            return res.status(200).json({data: {user_info: u_result, teacher_info: t_result.dataValues}, message: "Update teacher information"})
        }
    }
}

const updateMatch = async(req, res) => {
    const { userID } = req
    try {
        const match_id = req.body.match_id
        const status = req.body.status
        // status : "wait", "refuse", "approve"
        const match = await db.Matching.findOne({where:{id: match_id}})
        if (match.dataValues.status == 'wait') {
            await match.update({status: status})
            await match.save({ fields: ['status'] });
            const result = await match.reload();
            return res.status(200).json({data: result, message: "Update matching request"})
        }
        else{
            return res.status(400).json({success: false, message: "You can't change this status any more"})
        }
    } catch (err){
        req.body.teacherID = userID
        const result = await db.Teacher.create(req.body)
        return res.status(200).json({data: result, message: "Create new teacher information"})
    }
}

const getTeacher = async (req, res) => {
    try {
        const { userID } = req;
        const user = await db.User.findOne({where:{id: userID}});
        const {password, ...user_info} = user.dataValues
        try {
            const teacher = await db.Teacher.findOne({where:{teacherID: userID}});
            let {teacherID, ...teacher_info} = teacher.dataValues
            try{
                const schedulers = await db.Scheduler.findAll({where: {teacherID: userID}})
                let result = {...user_info, ...teacher_info, schedulers}
                return res.status(200).json({data: result, schedulers})
            } catch {
                let result = {...user_info, ...teacher_info}
                return res.status(200).json({data: result})
            }
        } catch {
            let result = {...user_info}
            return res.status(200).json({data: result})
        }
    } catch (err) {
        return res.status(400).json({success:false, message: "Can't get user information" });
    }
}

module.exports = {
    infoTeacher,
    getTeacher,
    postTeacher,
    updateMatch,
    StudentList
}