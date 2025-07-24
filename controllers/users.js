//undone


import express from 'express'
import Workout from '../models/workout.js'
import isSignedIn from '../middleware/isSignedIn.js'

const router = express.Router()

//personal workout route 
//path: /users/personal 
//method: GET
//purpose: get the logged in user personal workout 

router.get('/personal', isSignedIn, async (req, res, next) => {
    try {
        const loggedInUser = req.session.user._id

        //get all workout owned or copied by user 
        const ownedWorkouts = await Workout.find({
            user: loggedInUser
        })

        //subscribed by logged in user
        const subscribedworkout = await Workout.find({
            subscribedByUsers: loggedInUser
        })

        return res.render('users/personal.ejs', {
            ownedWorkouts,
            subscribedworkout
    
        })
    } catch (error) {
        next(error)

    }
})


export default router