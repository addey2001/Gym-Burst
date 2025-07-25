//undone


import express from 'express'
import Workout from '../models/workout.js'
import isSignedIn from '../middleware/isSignedIn.js'
import { isObjectIdOrHexString } from 'mongoose'

const router = express.Router()

const workoutTemplates = {
    chest: {
        title: "chest Workout",
        exercises: [
            'Name: Push-ups, Sets: 3, Reps: 10',
            'Name: Barbell bench press, Sets: 2, Reps: 12',
            'Name: Incline bench press, Sets: 3, Reps: 10',
            'Name: Chest dips, Sets: 3, Reps: 5',
            'Name: Chest flys, Sets: 3, Reps: 12'


        ]

    },
    legs: {
        title: 'Legs workout',
       exercises: [
        'Name: Barbell squats, Sets: 3, Reps: 8',
        'Name: Goblet squats, Sets: 3, Reps: 8',
        'Name: Bulgarian split squats, Sets: 3, Reps: 5',
        'Name: Lunges, Sets: 3, Reps: 10',
        'Name: Romanian dead lifts, Sets: 3, Reps: 8'
       ]
        },

Back: {
    title: 'Back workout',
    exercises: [
        'Name: Pull-ups, Sets: 3, Reps: 5',
        'Name: Barbell bent-over rows, Sets: 3, Reps: 10',
        'Name: Lat pull-downs, Sets: 3, Reps: 12',
        'Name: T-Bar Row, Sets: 3, Reps: 10',
        'Name: Back extensions, Sets: 3, Reps: 10'
       
    ]
}, 
arms: {
    title: 'Arms workout',
     exercises : [
        'Name: Barbell bicep curls, Sets: 3, Reps: 10',
        'Name: Hammer curls, Sets: 3, Reps: 10',
        'Name: Preacher curls, Sets: 3, Reps: 10',
        'Name: Skull crushers, Sets: 3, Reps: 10',
        'Name: Tricep pull-downs, Sets: 3, Reps: 10'
       ]
},
shoulders: {
    title: 'Shoulders workout',
     exercises : [
        'Name: Frontal raises , Sets: 3, Reps: 8',
        'Name: Lateral raises, Sets: 3, Reps: 8',
        'Name: Rear delt flyes, Sets: 3, Reps: 8',
        'Name: Dumbbell shoulder press, Sets: 3, Reps: 10',
        'Name:Face pulls , Sets: 3, Reps: 8'
       ]
}
    }

 



//-----controllers-------
router.get('/templates/:templateName', async (req, res, next) => {

    const { templateName } = req.params

    console.log(workoutTemplates[templateName])
    return res.render('workouts/templates/show.ejs', {
        workout: workoutTemplates[templateName],
        templateName
    })


})
//create logic
router.post('', isSignedIn, async (req, res, next) => {

    try{
    const { templateName } = req.query

    const templateToUse = workoutTemplates[templateName]

    templateToUse.user = req.session.user._id

    const workout = await Workout.create(templateToUse)

    return res.redirect(`/workouts/${workout._id}/edit`)


} catch (error) {
    next(error)
}
})





//display all workouts
router.get('', async (req, res, next) => {
    try {
        const workouts = await Workout.find()
        return res.render('workouts/index.ejs', { workouts })
    } catch (error) {
        next(error)
    }
})


//new route 
//path: /workouts/new
router.get('/new', isSignedIn, (req, res, next) => {
    try {
        return res.render('users/personal.ejs')
    } catch (error) {
        next(error)
    }
})
//show 
router.get('/:workoutId', isSignedIn , async (req, res,next) =>{
try {
    const { workoutId } = req.params

const workout = await Workout.findById(workoutId)
   return res.render('workouts/show.ejs', {workout}) 
} catch (error) {
    next (error)
}
})


//edit form
router.get('/:templateId/edit', isSignedIn, async (req, res, next) => {
    try{
        const {templateId} = req.params
        const workout = await Workout.findById(templateId)

        if (!workout.user.equals(req.session.user._id)) {
            return res.status(403).send('You are not allowed access to this resourc')
        }
      return res.render('workouts/edit.ejs', {workout})
    }catch (error) {
        next(error)
    }

})


// update route 
router.put('/:templateId', isSignedIn, async (req, res, next) => {
    try{
        const { templateId} = req.params
        const { title, exercises } = req.body
        const workoutToUpdate = await Workout.findById(templateId)
        if (!workoutToUpdate.user.equals(req.session.user._id)) {
            return res.status(403).send('You are not allowed access to this resource')
        }
        workoutToUpdate.title = title
        workoutToUpdate.exercises = exercises
        await workoutToUpdate.save()
console.log(req.body)
return res.redirect(`/workouts/${workoutToUpdate._id}`)
    } catch (error) {
        next(error)
    }
})

//delete route
router.delete('/:templateId', isSignedIn, async (req, res, next) => {
    try {
        const {templateId} = req.params
         const workoutToDelete = await Workout.findById(templateId)

         if (!workoutToDelete) {
            return next()
         }

         if (!workoutToDelete.user.equals(req.session.user._id)) {
            return res.status(403).send('you are not allowed access to these resources')
         }
         console.log(req)

        await workoutToDelete.deleteOne()

    return res.redirect('/workouts')

    } catch (error) {
        next (error)
    }
})



//export route
export default router


