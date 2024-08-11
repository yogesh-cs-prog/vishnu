import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './backend/router/userRouter.js';
import adminRouter from './backend/router/adminRouter.js';
import path from 'path'
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { connectDB } from './backend/db/db.js';

const app = express()
app.use(express.json())
app.use(cookieParser())
app.set('view engine', 'ejs')
const __filename = fileURLToPath(import.meta.url)
const __dirname= path.dirname(__filename)

app.use(bodyParser.urlencoded({ extended : true}))

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))

await connectDB()


const PORT = `http://localhost:3000/`


app.use(userRouter)
app.use('/api/admin', adminRouter)

app.get('/login', (req, res) => {
    res.render('auth/userLogin')
})




app.listen(3000, () => {
    console.log(`App is running in port ${PORT}` )
})