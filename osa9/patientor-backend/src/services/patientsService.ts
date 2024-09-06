import patients from '../data/patients';
import { v4 as uuidv4 } from 'uuid';
import { NewPatient, PublicPatient } from '../types';

const getPatients = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const findById = (id: string): PublicPatient | undefined => {
  const entry = patients.find((p) => p.id === id);
  return entry;
};

const addPatient = (patient: NewPatient) => {
  const id = uuidv4();
  const newPatient = {
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
