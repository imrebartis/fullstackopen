export function parseArguments(
  args: string[],
  expectedLength: number
): number[] {
  if (args.length < expectedLength) {
    throw new Error(
      `Error: Expected at least ${expectedLength} arguments, but got ${args.length}`
    );
  }

  const numbers = args.map((arg) => {
    const num = parseFloat(arg);
    if (isNaN(num)) {
      throw new Error(`Invalid input: "${arg}" is not a number`);
    }
    return num;
  });

  return numbers;
}

export function validateNonNegativeNumbers(numbers: number[], errorMessage: string): void {
  if (numbers.some(num => num < 0)) {
    throw new Error(errorMessage);
  }
}
