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
  const success = trainingDays === periodLength
  const total = trainingHours.reduce((acc, cur) => acc + cur, 0)
  const average = total / periodLength

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
