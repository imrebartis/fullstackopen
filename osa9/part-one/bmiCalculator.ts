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
