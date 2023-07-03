const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors');
const sequelize = require('./database')


sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

const app = express()
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(cookieParser())

const userRoutes = require('./routes/userRoute')
const adminRoutes = require('./routes/adminRoute')
const teacherRoutes = require('./routes/teacherRoute')
const commentRoutes = require('./routes/commentRoute')
const authRoutes = require('./routes/authRoute')

app.get('/', (req, res) => {
    return res.json({
        message: 'Welcome to our website'
    })
})

app.use('/', userRoutes)
app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)
app.use('/teacher', teacherRoutes)
app.use('/comment', commentRoutes)

app.listen(5050, () => {
    console.log("Server is listening on port 5050")
})