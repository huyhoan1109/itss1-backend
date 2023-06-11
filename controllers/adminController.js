const db = require('../models')

const dashboard = async (req, res) => {
    
};

const allUser = async (req, res) => {

    const page = req.query.page || 1
    const limit = req.query.limit || 16

    db.User.findAndCountAll({...options, offset, limit})
        .then(async ({count, rows}) => {
            let results = []
            const totalPages = Math.ceil(count/limit);
            rows.forEach((user) => {
                let {password, ...info} = user.dataValues
                results.push(info)
            })            

            let message = ''
            if (count > 1) message = `Finded ${count} results`
            else message = `Finded ${count} result`
            
            return res.status(200).json({
                data: results, 
                infoPage: {
                    totalPages,
                    currentPage: page,
                    pageSize: limit
                },
                message
            })
        })
        .catch(() => {
            return res.status(400).json({success: false, message: "No teacher available"});
        })
};

const getUser = async (req, res) => {
    try {
        const userID = req.params.id;
        const user = await db.User.findOne({where:{id: userID}});
        const {password, ...user_info} = user.dataValues
        try {
            if (user.role == 'teacher') {
                const teacher = await db.Teacher.findOne({teacherID: userID});
                let {teacherID, ...teacher_info} = teacher.dataValues
                result = {...user_info, ...teacher_info}
            }
        } catch {
            result = user_info
        }
        return res.status(200).json({data: result})
    } catch (err) {
        return res.status(400).json({success:false, message: "Can't get user information"});
    }
};

const postUser = async (req, res) => {
    const userID = req.params.id 
    try {
        const update = {};
        const keys = Object.keys(req.body)
        for (const key of keys){
            if (req.body[key] !== '') {
                update[key] = req.body[key];
            }
        }
        const user = await db.User.findOne({where:{id: userID}})
        if (user.role != 'admin'){
            await user.update(update)
            await user.save({ fields: keys });
            const result = await user.reload();
            return res.status(200).json({data: result, message: "Update user information"})
        } else {
            return res.status(400).json({success: false, message: "Can't update fellow admin information"})
        }
    } catch {
        return res.status(400).json({success: false, message: "Can't update user information"})
    }
};

module.exports = {
    dashboard,
    allUser,
    getUser,
    postUser
}