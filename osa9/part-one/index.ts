import { calculateBMI } from './bmiCalculator'
import { calculateExercises } from './exerciseCalculator'

// const weight = 96
// const height = 2

// const bmiCategory = calculateBMI(weight, height)
// console.log(`Your BMI category is ${bmiCategory}`)

const trainingHours = [3, 0, 2, 4.5, 0, 3, 1]
const target = 2

const exerciseResults = calculateExercises(trainingHours, target)

console.log(exerciseResults)
