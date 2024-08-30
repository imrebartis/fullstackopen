export function parseArguments(
  args: string[],
  expectedLength: number
): number[] {
  if (args.length < expectedLength) {
    console.log(
      `Error: Expected at least ${expectedLength} arguments, but got ${args.length}`
    )
    process.exit(1)
  }

  const numbers = args.map((arg) => {
    const num = parseFloat(arg)
    if (isNaN(num)) {
      console.log(`Invalid input: "${arg}" is not a number`)
      process.exit(1)
    }
    return num
  })

  return numbers
}

export function validatePositiveNumbers(
  numbers: number[],
  errorMessage: string
) {
  if (numbers.some((num) => num <= 0)) {
    console.log(errorMessage)
    process.exit(1)
  }
}
