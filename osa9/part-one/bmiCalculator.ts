import { parseArguments, validateNonNegativeNumbers } from './validationHelper'

export function calculateBMI(weight: number, height: number): string {
  if (weight <= 0 || height <= 0) {
    return 'Invalid input: Weight and height must be positive numbers'
  }

  const bmi = weight / (height * height)

  switch (true) {
    case bmi < 17.5:
      return 'Underweight range'
    case bmi >= 17.5 && bmi < 25:
      return 'Normal range'
    case bmi >= 25 && bmi < 30:
      return 'Overweight range'
    case bmi >= 30 && bmi < 35:
      return 'Moderately obese range'
    case bmi >= 35 && bmi < 40:
      return 'Severely obese range'
    default:
      return 'Very severely obese range'
  }
}

export function runCLI() {
  try {
    const args = process.argv.slice(2)
    const [weight, height] = parseArguments(args, 2)

     // NB: You have to use the -- flag, i.e. sth like `npm run calculateBmi -- -80 2` to get the error message
    validateNonNegativeNumbers(
      [weight, height],
      'Invalid input: Weight and height must be positive numbers'
    )

    const bmiCategory = calculateBMI(weight, height)
    console.log(`Your BMI category is ${bmiCategory}`)
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  runCLI()
}
