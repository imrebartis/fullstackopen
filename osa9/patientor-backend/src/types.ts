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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {
};

export type Patient = {
  id: string
  name: string
  dateOfBirth: string
  ssn: string
  gender: string
  occupation: string
  entries: Entry[]
};

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

export type PublicPatient = Omit<Patient, 'ssn'>;

export type NewPatient = z.infer<typeof NewPatientSchema>;
