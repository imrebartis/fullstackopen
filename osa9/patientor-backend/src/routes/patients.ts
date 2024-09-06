import express, { Response } from 'express';
import patientsService from '../services/patientsService';

import { PublicPatient } from '../types';

const router = express.Router();

router.get('/', (_req, res: Response<PublicPatient[]>) => {
  res.send(patientsService.getPatients());
});

export default router;
