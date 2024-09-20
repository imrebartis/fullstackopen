import patients from '../data/patients';
import { v4 as uuidv4 } from 'uuid';
import { Entry, EntryWithoutId, Patient } from '../types';
import { NewPatientType } from '../utils/toNewPatient';

const getPatients = (): Patient[] => {
  return patients.map(
    ({ id, name, ssn, dateOfBirth, gender, occupation, entries }) => ({
      id,
      name,
      ssn,
      dateOfBirth,
      gender,
      occupation,
      entries
    })
  );
};

const findById = (id: string): Patient | undefined => {
  const patient = patients.find((p) => p.id === id);
  if (patient) {
    const { id, name, ssn, dateOfBirth, gender, occupation, entries } = patient;
    return { id, name, ssn, dateOfBirth, gender, occupation, entries };
  }
  return undefined;
};

const addPatient = (patient: NewPatientType): Patient => {
  const id = uuidv4();
  const newPatient: Patient = {
    id,
    ...patient
  };

  patients.push(newPatient);
  return newPatient;
};

const getEntries = (id: string): Entry[] | undefined => {
  const patient = patients.find((p) => p.id === id);
  if (patient) {
    return patient.entries;
  }
  return undefined;
};

const addEntry = (
  patientId: string,
  entry: EntryWithoutId
): Entry | undefined => {
  const patient = patients.find((p) => p.id === patientId);
  if (!patient) {
    return undefined;
  }

  const newEntry: Entry = {
    id: uuidv4(),
    ...entry
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  findById,
  addPatient,
  getEntries,
  addEntry
};
