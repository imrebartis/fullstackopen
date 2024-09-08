import { z } from 'zod';
import { NewPatientSchema } from './utils/toNewPatient';

export type Diagnosis = {
  code: string
  name: string
  latin?: string
};

export enum Gender {
  Female = 'female',
  Male = 'male',
  Other = 'other'
};

export type Patient = {
  id: string
  name: string
  dateOfBirth: string
  ssn: string
  gender: string
  occupation: string
};

export type PublicPatient = Omit<Patient, 'ssn'>;

export type NewPatient = z.infer<typeof NewPatientSchema>;
