import patients from '../data/patients';
import { v4 as uuidv4 } from 'uuid';
import { Patient } from '../types';
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
  const entry = patients.find((p) => p.id === id);
  if (entry) {
    const { id, name, ssn, dateOfBirth, gender, occupation, entries } = entry;
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

export default {
  getPatients,
  findById,
  addPatient
};
