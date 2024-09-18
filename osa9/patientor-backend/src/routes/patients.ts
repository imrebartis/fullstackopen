import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import patientsService from '../services/patientsService';
import { NewPatientSchema, NewPatientType } from '../utils/toNewPatient';

import { Patient } from '../types';

const router = express.Router();

router.get('/', (_req, res: Response<Patient[]>) => {
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

const NewPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    console.log(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.post(
  '/',
  NewPatientParser,
  (req: Request<unknown, unknown, NewPatientType>, res: Response<Patient>) => {
    const newPatient = req.body;
    const addedPatient = patientsService.addPatient(newPatient);
    res.json(addedPatient);
  }
);

router.use(errorMiddleware);

export default router;
