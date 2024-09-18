import { z } from 'zod';
import { EntryType, Gender, HealthCheckRating } from '../types';

const BaseEntrySchema = z.object({
  id: z.string().min(1),
  description: z.string().min(1),
  date: z.string().date(),
  specialist: z.string().min(1),
  diagnosisCodes: z.array(z.string()).optional()
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal(EntryType.HealthCheck),
  healthCheckRating: z.nativeEnum(HealthCheckRating)
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal(EntryType.Hospital),
  discharge: z.object({
    date: z.string().date(),
    criteria: z.string().min(1)
  })
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal(EntryType.OccupationalHealthcare),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string().date(),
      endDate: z.string().date()
    })
    .optional()
});

export const EntrySchema = z.discriminatedUnion('type', [
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema
]);

export const NewPatientSchema = z.object({
  name: z.string().min(1),
  dateOfBirth: z.string().date(),
  ssn: z.string().min(1),
  gender: z.nativeEnum(Gender),
  occupation: z.string().min(1),
  entries: z.array(EntrySchema)
});

export type NewPatientType = z.infer<typeof NewPatientSchema>;
export type NewEntryType = z.infer<typeof EntrySchema>;
