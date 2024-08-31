import { parseArguments, validateNonNegativeNumbers } from './validationHelper'

interface Result {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

export function calculateExercises(
  trainingHours: number[],
  target: number
): Result {
  const periodLength = trainingHours.length
  const trainingDays = trainingHours.filter((h) => h > 0).length
  const total = trainingHours.reduce((acc, cur) => acc + cur, 0)
  const average = total / periodLength
  const success = trainingHours.every((h) => h >= target)

  let rating: number
  let ratingDescription: string

  switch (true) {
    case average >= target:
      rating = 3
      ratingDescription = 'Excellent'
      break
    case average >= target - 0.5:
      rating = 2
      ratingDescription = 'Not too bad but could be better'
      break
    default:
      rating = 1
      ratingDescription = 'You need to work harder'
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  }
}

export function runCLI() {
  try {
    const args = process.argv.slice(2)
    const numbers = parseArguments(args, 2)

    const target = numbers[0]
    const trainingHours = numbers.slice(1)

    // NB: You have to use the -- flag, i.e. sth like `npm run calculateExercises -- -2 1 3 4 5 6 7` to get the error message
    validateNonNegativeNumbers(
      [target, ...trainingHours],
      'Invalid input: Target and training hours must be positive numbers'
    )

    const exerciseResults = calculateExercises(trainingHours, target)
    console.log(exerciseResults)
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  runCLI()
}
