const { paginate } = require('../helper');
const db = require('../models')
const { Op } = require('sequelize');

const getComment = async (req, res) => {
    const teacherID = req.params.id
    const page = req.query.page || 1
    const limit = req.query.limit || 16
    db.Comment.findAndCountAll({
        where: {teacherID},
        include: {
            model: db.User
        },
        ...paginate(page, limit)
    }).then(({count, rows}) => {
        let results = []
        rows.forEach((info) => {
            let {userID, ...rest} = info.dataValues
            let {User, ...content} = rest
            let {password, ...user_info} = User.dataValues
            results.push({...user_info, ...content})
        })
        return res.status(200).json({data: results});
    }).catch(() => {
        return res.status(400).json({success: false, message: "No comment available"});
    })

}

const createComment = async (req, res) => {
    const teacherID = req.params.id
    const studentID = req.userID
    try {
        const result = await db.Comment.create({
            teacherID,
            studentID,
            content: req.body.content,
            star: req.body.star
        })
        return res.status(200).json({data: result});
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
        const comment = await db.Comment.findOne({id})
        if (comment.studentID == req.userID){
            await comment.update(update)
            await comment.save({ fields: keys });
            const result = await comment.reload();
            return res.status(200).json({data: result, message: "Update cpmment information"});
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
        const comment = db.Comment.findOne({id})
        if (comment.studentID == req.userID){
            await db.Comment.destroy({
                where: {id}
            });
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