import { useState, useEffect, useCallback } from 'react';
import { Patient, EntryWithoutId } from '../types';
import patientService from '../services/patients';

export const usePatient = (id: string | undefined) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatient = useCallback(async () => {
    if (!id) {
      setError('Patient ID is missing');
      setLoading(false);
      return;
    }

    try {
      const patientData = await patientService.getPatient(id);
      if (patientData) {
        setPatient(patientData);
      } else {
        setError('Patient not found');
      }
    } catch (e) {
      setError('Failed to fetch patient data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  const addEntry = useCallback(async (newEntry: EntryWithoutId) => {
    if (!patient || !id) {
      setError('Cannot add entry: Patient data is missing');
      return;
    }

    try {
      const addedEntry = await patientService.addEntry(id, newEntry);
      setPatient(prevPatient => {
        if (!prevPatient) return null;
        return {
          ...prevPatient,
          entries: [...prevPatient.entries, addedEntry]
        };
      });
    } catch (e) {
      setError('Failed to add new entry');
    }
  }, [patient, id]);

  return { patient, loading, error, addEntry };
};
