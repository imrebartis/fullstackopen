import { useState } from 'react';
import { NewDiaryEntry } from '../types';

const useForm = (initialState: NewDiaryEntry) => {
  const [form, setForm] = useState(initialState);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setForm(initialState);

  return { form, handleChange, resetForm };
};

export default useForm;
