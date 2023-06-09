const { paginate } = require('../helper');
const db = require('../models')

const getComment = async (req, res) => {
    const teacherID = req.params.id
    const currentPage = req.query.page || 1
    const pageSize = req.query.limit || 16
    const {offset, limit} = paginate(currentPage, pageSize)
    db.Comment.findAndCountAll({
        where: {teacherID: teacherID},
        include: {
            model: db.User
        },
        offset,
        limit,
        distinct: true
    }).then(({count, rows}) => {
        let results = []
        rows.forEach((info) => {
            let {teacherID, ...rest} = info.dataValues
            let {User, ...content} = rest
            let {password, ...user_info} = User.dataValues
            results.push({...user_info, ...content})
        })
        let totalPages = Math.ceil(count/limit)
        
        let message = ''
        if (count > 1) message = `Finded ${count} comments`
        else message = `Finded ${count} comment`
        
        return res.status(200).json({
            data: results,
            infoPage: {
                totalPages,
                currentPage,
                pageSize
            },
            message
        });
    }).catch(() => {
        return res.status(400).json({success: false, message: "No comment available"});
    })
}

const createComment = async (req, res) => {
    const teacherID = req.params.id
    const userID = req.userID
    try {
        const result = await db.Comment.create({
            teacherID,
            userID,
            content: req.body.content,
            star: req.body.star
        })
        const sum_stars = await db.Comment.sum('star', {where: {teacherID: teacherID}})
        const comments_length = await db.Comment.count({where: {teacherID: teacherID}})
        const teacher = await db.Teacher.findOne({where: {teacherID: teacherID}})
        await teacher.update({star_average: comments_length > 0 ? sum_stars / comments_length : 0})
        await teacher.save({ fields: ['star_average'] });
        return res.status(200).json({data: result, message: "Created comment successfully"});
    } catch {
        return res.status(400).json({success: false, message: "Can't create comment"});
    }
}

const postComment = async (req, res) => {
    const id = req.params.id
    try {
        const update = {};
        const keys = Object.keys(req.body)
        for (const key of keys){
            if (req.body[key] !== '') {
                update[key] = req.body[key];
            }
        }
        const comment = await db.Comment.findOne({where:{id:id}})
        if (comment.userID == req.userID){
            await comment.update(update)
            await comment.save({ fields: keys });
            const result = await comment.reload();
            const sum_stars = await db.Comment.sum('star', {where: {teacherID: comment.teacherID}})
            const comments_length = await db.Comment.count({where: {teacherID: comment.teacherID}})
            const teacher = await db.Teacher.findOne({where: {teacherID: comment.teacherID}})
            await teacher.update({star_average: comments_length > 0 ? sum_stars / comments_length : 0})
            await teacher.save({ fields: ['star_average'] });
            return res.status(200).json({data: result, message: "Update comment successfully"});
        }
        else {
            return res.status(400).json({success: false, message: "This is not your comment"});
        }
    } catch {
        return res.status(400).json({success: false, message: "Can't update comment"});
    }
}

const delComment = async (req, res) => {
    const id = req.params.id
    try {
        const comment = await db.Comment.findOne({where:{id:id}})
        const teacherID = comment.teacherID
        if (comment.dataValues.userID == req.userID){
            const result = await db.Comment.destroy({where: {id:id}, force: true});
            const sum_stars = await db.Comment.sum('star', {where: {teacherID: teacherID}})
            const comments_length = await db.Comment.count({where: {teacherID: teacherID}})
            const teacher = await db.Teacher.findOne({where: {teacherID: teacherID}})
            await teacher.update({star_average: comments_length > 0 ? sum_stars / comments_length : 0})
            await teacher.save({ fields: ['star_average'] });
            return res.status(200).json({data: result, message: "Delete comment successfully"});
        } else {
            return res.status(400).json({success: false, message: "This is not your comment"});
        }
    } catch {
        return res.status(400).json({success: false, message: "Can't delete comment"});
    }
}

module.exports = {
    getComment,
    createComment,
    postComment,
    delComment
}