import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { DiaryEntry, NewDiaryEntry } from '../types';
import { getAllDiaries, createDiary } from '../services/diariesService';

interface ValidationError {
  message: string
  errors: Record<string, string[]>
}

const useDiaries = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDiaries = async () => {
      setLoading(true);
      try {
        const diariesData = await getAllDiaries();
        setDiaries(diariesData);
      } catch (error) {
        if (
          axios.isAxiosError<ValidationError, Record<string, unknown>>(error)
        ) {
          setError(String(error.response?.data ?? error.message));
          console.log(error);
        } else {
          setError('Failed to fetch diaries');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDiaries();
  }, []);

  const handleCreateDiary = useCallback(async (newDiary: NewDiaryEntry) => {
    setLoading(true);
    try {
      const addedDiary = await createDiary(newDiary);
      setDiaries((prevDiaries) => [...prevDiaries, addedDiary]);
    } catch (error) {
      if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
        setError(String(error.response?.data ?? error.message));
        console.log(error.response?.data);
      } else {
        setError('Failed to create diary');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { diaries, error, loading, handleCreateDiary, clearError };
};

export default useDiaries;
