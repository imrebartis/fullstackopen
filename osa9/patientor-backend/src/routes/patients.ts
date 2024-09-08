import express, { Response } from 'express';
import patientsService from '../services/patientsService';
import toNewPatient from '../utils/toNewPatientEntry';

import { PublicPatient } from '../types';

const router = express.Router();

router.get('/', (_req, res: Response<PublicPatient[]>) => {
  res.send(patientsService.getPatients());
});

router.get('/:id', (req, res) => {
  const patient = patientsService.findById(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientsService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
