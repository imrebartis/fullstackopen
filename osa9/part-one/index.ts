import express, { Request, Response } from 'express';
import { calculateBMI } from './bmiCalculator';
import { validateNonNegativeNumbers } from './validationHelper';
import { calculateExercises } from './exerciseCalculator';

interface ExerciseInput {
  daily_exercises: number[];
  target: number;
}

const app = express();

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  try {
    const { weight, height } = req.query;

    if (!weight || !height) {
      return res.status(400).json({ error: 'Missing weight or height' });
    }

    const weightNum = parseFloat(weight as string);
    const heightNum = parseFloat(height as string);

    if (isNaN(weightNum) || isNaN(heightNum)) {
      return res
        .status(400)
        .json({ error: 'Weight and height must be numbers' });
    }

    validateNonNegativeNumbers(
      [weightNum, heightNum],
      'Weight and height must be positive numbers'
    );

    const heightInMeters = heightNum / 100;
    const bmi = calculateBMI(weightNum, heightInMeters);
    return res.json({
      weight: weightNum,
      height: heightNum,
      bmi
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
});

app.post('/exercises', express.json(), (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target }: ExerciseInput = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  if (
    !Array.isArray(daily_exercises) ||
    !daily_exercises.every((num) => typeof num === 'number') ||
    typeof target !== 'number'
  ) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  try {
    validateNonNegativeNumbers(daily_exercises, 'daily_exercises must be non-negative numbers');
    validateNonNegativeNumbers([target], 'target must be a non-negative number');

    const result = calculateExercises(daily_exercises, target);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
