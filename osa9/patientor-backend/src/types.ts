import { z } from 'zod';
import { NewPatientSchema, EntrySchema } from './utils/toNewPatient';

export type Diagnosis = {
  code: string
  name: string
  latin?: string
};

export enum Gender {
  Female = 'female',
  Male = 'male',
  Other = 'other'
}

export enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3
}

export enum EntryType {
  HealthCheck = 'HealthCheck',
  Hospital = 'Hospital',
  OccupationalHealthcare = 'OccupationalHealthcare'
}

export type Entry = z.infer<typeof EntrySchema>;
export type Patient = z.infer<typeof NewPatientSchema> & { id: string };
export type PublicPatient = Omit<Patient, 'ssn'>;
export type NewPatient = z.infer<typeof NewPatientSchema>;

export type HealthCheckEntry = Extract<Entry, { type: EntryType.HealthCheck }>;
export type HospitalEntry = Extract<Entry, { type: EntryType.Hospital }>;
export type OccupationalHealthcareEntry = Extract<
  Entry,
  { type: EntryType.OccupationalHealthcare }
>;
