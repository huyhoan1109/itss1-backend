const db = require('../models')
const {paginate} = require('../helper')
const dashboard = async (req, res) => {
    
};

const allUser = async (req, res) => {
    const currentPage = req.query.page || 1
    const pageSize = req.query.limit || 16
    const options ={ 
        where: {}
    }
    const {offset, limit} = paginate(currentPage, pageSize)
    db.User.findAndCountAll({...options, offset, limit})
        .then(async ({count, rows}) => {
            let results = []
            const totalPages = Math.ceil(count/limit);
            rows.forEach((user) => {
                let {password, otp, ...info} = user.dataValues
                results.push(info)
            })            
            let message = ''
            if (count > 1) message = `Finded ${count} results`
            else message = `Finded ${count} result`
            console.log(results)
            return res.status(200).json({
                data: results, 
                infoPage: {
                    totalPages,
                    currentPage,
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
                const teacher = await db.Teacher.findOne({where:{teacherID: userID}});
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

const allStudent = async (req, res) => {
    const currentPage = req.query.page || 1
    const pageSize = req.query.limit || 16
    const options ={ 
        where: {
            role: 'student'
        }
    }
    const {offset, limit} = paginate(currentPage, pageSize)
    db.User.findAndCountAll({...options, offset, limit})
        .then(async ({count, rows}) => {
            let results = []
            const totalPages = Math.ceil(count/limit);
            rows.forEach((user) => {
                let {password, otp, ...info} = user.dataValues
                results.push(info)
            })            
            let message = ''
            if (count > 1) message = `Finded ${count} results`
            else message = `Finded ${count} result`
            console.log(results)
            return res.status(200).json({
                data: results, 
                infoPage: {
                    totalPages,
                    currentPage,
                    pageSize: limit
                },
                message
            })
        })
        .catch(() => {
            return res.status(400).json({success: false, message: "No teacher available"});
        })
}

const allTeacher = async (req, res) => {
    const currentPage = req.query.page || 1
    const pageSize = req.query.limit || 16
    const options ={ 
        include: {
            model: db.User
        }
    }
    const {offset, limit} = paginate(currentPage, pageSize)
    db.Teacher.findAndCountAll({...options, offset, limit})
        .then(({count, rows}) => {
            let results = []
            const totalPages = Math.ceil(count/limit);
            rows.forEach((teacher) => {
                let {User, ...teacher_info} = teacher.dataValues
                let {password, otp, ...user_info} = User.dataValues
                results.push({...user_info, ...teacher_info})
            })            
            let message = ''
            if (count > 1) message = `Finded ${count} results`
            else message = `Finded ${count} result`
            console.log(results)
            return res.status(200).json({
                data: results, 
                infoPage: {
                    totalPages,
                    currentPage,
                    pageSize: limit
                },
                message
            })
        })
        .catch(() => {
            return res.status(400).json({success: false, message: "No teacher available"});
        })
}

module.exports = {
    dashboard,
    allUser,
    getUser,
    postUser,
    allStudent,
    allTeacher
}