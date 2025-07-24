import express from 'express'
import User from '../models/user.js'
import { getUserObject } from '../utils/session.js'
import bcrypt from 'bcrypt'




const router = express.Router()



//controllers 

router.get('/sign-up', (req, res, next) => {
    try {
        res.render('auth/sign-up.ejs') // gives direct admission to the sign up page in the auth folder 
    } catch (error) {
        next(error)
    }
})


router.get('/sign-in', (req, res, next) => {
    try {
        res.render('auth/sign-in.ejs')
    } catch (error) {
        next(error)
    }
})

// sign up 
router.post('/sign-up', async (req, res, next) => {
    try {
        const { username, password, confirmPassword } = req.body

        if (username.trim() === '') throw new Error('please give a username ')
        if (password.trim() === '') throw new Error('Please give a password') // check the fields are not empty 
    // checks if username already exists
    const existUser = await User.findOne({username: username})
    if(existUser) throw new Error('sorry username already exists. Try another one')

    //checks if passwords are matching 
    if (password !== confirmPassword) throw new Error('passwords do not match, try again')
     
        const user = await User.create(req.body) // creates user using all req.body properties
// flash message 
req.session.message = 'your account was successfully created!'

req.session.user = getUserObject(user) // indicates user authentication

req.session.save(() => {
    return res.redirect('/')
})
  } catch (error) {
    error.renderForm = true
    next(error)
  }
})

//Sign - In
router.post('/sign-in', async (req, res, next) => {
    try {
        const {username, password, confirmPassword} = req.body

    
        const existUser = await User.findOne({ usernme: username })
        if (!existUser)throw new Error('wrong username or password, try again')
//checks if passwords match
            if(!bcrypt.compareSync(password, existUser.password)) {
               throw new Error('Wrong password or username, try again')
            }
            req.session.user = getUserObject(existUser)

            req.session.save(() => {
                res.redirect('/')
            })
    } catch(error) {
        console.log(error)
        error.renderForm = true
        next (error)
    }
}
)

//sign- out 

router.get('sign-out', (req, res) => {
    try{
        req.session.destroy(() => {
            res.redirect('/auth/sign-in')
        })
    } catch (error) {
        console.log(error)
    }
})




// export router 
export default router 
