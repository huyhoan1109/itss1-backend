const db = require('../models');

const getUser = async (req, res) => {
    try {
        const { userID } = req;
        const user = await db.User.findOne({where:{id: userID}});
        try {
            if (user.role == 'teacher') {
                const teacher = await db.Teacher.findOne({teacherID: userID});
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

module.exports = {
    getUser,
    postUser,
    requestMatch
}