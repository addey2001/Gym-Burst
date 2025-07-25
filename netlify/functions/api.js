import serverless from 'serverless-http'
import express from 'express'
import 'dotenv/config'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
import session from 'express-session'
import morgan from 'morgan'
import methodOverride from 'method-override'

//routers
import authRouter from '../../controllers/auth.js'
import workoutRouter from '../../controllers/workouts.js'
import userRouter from '../../controllers/users.js'
import User from '../../models/user.js'
import passUserToView from '../../middleware/passUsertoView.js'
import passMessageToView from '../../middleware/passMessagetoView.js'

//--------const------------
const app = express()
const port = process.env.PORT || 9000



//----middleware------
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  })
}))
app.use(express.static('public'))
app.use(passUserToView)
app.use(passMessageToView)




//--------server connection-------

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})



//-------- routes section --------
app.use('/auth', authRouter)
app.use('/workouts', workoutRouter)// allows me to code in the controllers without having to code in the full pathway 
app.use('/users', userRouter)
//home route 
app.get('/', (req, res) => {
  res.render('home.ejs')
})

//-----------error middle ware------------
//404 page 
app.use((req, res)=> {
  return res.status(404).render('errors/404.ejs')
}
)
//error page
app.use((err, req, res, next) => {
  console.log(err)


//handle redirects from invalidated forms
if(err.renderForm){
  req.session.message = err.message
  return req.session.save(() => {
    res.status(400).redirect(err.renderPath || req.originalUrl)
  })
}
  return res.status(500).render('errors/error-page.ejs')

})
export const handler = serverless(app)








