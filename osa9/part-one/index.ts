import { calculateBMI } from './bmiCalculator'

const weight = 96
const height = 2

const bmiCategory = calculateBMI(weight, height)
console.log(`Your BMI category is ${bmiCategory}`)
