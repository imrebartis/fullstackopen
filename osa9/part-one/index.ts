import express from 'express';
import { calculateBMI } from './bmiCalculator';
import { validateNonNegativeNumbers } from './validationHelper';

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

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
