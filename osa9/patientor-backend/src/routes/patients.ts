import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import patientsService from '../services/patientsService';
import { NewPatientSchema, NewPatientType } from '../utils/toNewPatient';

import { Diagnosis, EntryWithoutId, Patient } from '../types';

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

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
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

router.get('/:id/entries', (req, res) => {
  const entries = patientsService.getEntries(req.params.id);

  if (entries) {
    res.send(entries);
  } else {
    res.sendStatus(404);
  }
});

router.post(
  '/:id/entries',
  (
    req: Request<{ id: string }, unknown, EntryWithoutId>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const patientId = req.params.id;
      const newEntry: EntryWithoutId = req.body;
      newEntry.diagnosisCodes = parseDiagnosisCodes(newEntry);

      const addedEntry = patientsService.addEntry(patientId, newEntry);

      if (!addedEntry) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      return res.status(201).json(addedEntry);
    } catch (error) {
      next(error);
    }

    return res.status(500).json({ error: 'Unexpected error' });
  }
);

router.use(errorMiddleware);

export default router;
