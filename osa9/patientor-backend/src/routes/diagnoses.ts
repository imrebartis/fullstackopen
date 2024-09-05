import express, { Response } from 'express';
import { Diagnosis } from '../types';
import diagnosesService from '../services/diagnosesService';

const router = express.Router();

router.get('/', (_req, res: Response<Diagnosis[]>) => {
  res.send(diagnosesService.getEntries());
});

export default router;
