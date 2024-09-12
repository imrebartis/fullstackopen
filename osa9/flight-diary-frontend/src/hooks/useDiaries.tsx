import { useState, useEffect, useCallback } from 'react';
import { DiaryEntry, NewDiaryEntry } from '../types';
import { getAllDiaries, createDiary } from '../services/diariesService';

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
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to create diary');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { diaries, error, loading, handleCreateDiary };
};

export default useDiaries;
