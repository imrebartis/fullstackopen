import { useState, useEffect } from 'react';
import { Diagnosis } from '../types';
import diagnosisService from '../services/diagnoses';

export const useDiagnosis = () => {
  const [diagnoses, setDiagnosis] = useState<Diagnosis[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const diagnosesData = await diagnosisService.getAll();
        if (diagnosesData) {
          setDiagnosis(diagnosesData);
        } else {
          setError('Diagnoses not found');
        }
      } catch (e) {
        setError('Failed to fetch diagnoses data');
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, []);

  return { diagnoses, loading, error };
};
