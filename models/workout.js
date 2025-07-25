import mongoose from 'mongoose'


const workoutSchema = new mongoose.Schema({
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    exercises: [{type: String, required: true}]
})

console.log(workoutSchema)


const Workout = mongoose.model('Workout', workoutSchema)

export default Workout 
