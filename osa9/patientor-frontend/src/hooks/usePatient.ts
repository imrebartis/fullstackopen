import { useState, useEffect } from 'react';
import { Patient } from '../types';
import patientService from '../services/patients';

export const usePatient = (id: string | undefined) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
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
    };

    fetchPatient();
  }, [id]);

  return { patient, loading, error };
};
