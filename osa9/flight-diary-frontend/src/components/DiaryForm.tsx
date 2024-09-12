import useForm from '../hooks/useForm';
import { NewDiaryEntry, Weather, Visibility } from '../types';

const DiaryForm: React.FC<{ onSubmit: (diary: NewDiaryEntry) => void }> = ({
  onSubmit
}) => {
  const { form, handleChange, resetForm } = useForm({
    date: '',
    visibility: Visibility.Good,
    weather: Weather.Sunny,
    comment: ''
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(form);
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Date:</label>
        <input
          type='date'
          name='date'
          value={form.date}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Visibility:</label>
        <select
          name='visibility'
          value={form.visibility}
          onChange={handleChange}
        >
          {Object.values(Visibility).map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Weather:</label>
        <select name='weather' value={form.weather} onChange={handleChange}>
          {Object.values(Weather).map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Comment:</label>
        <input
          type='text'
          name='comment'
          value={form.comment}
          onChange={handleChange}
        />
      </div>
      <button type='submit'>add</button>
    </form>
  );
};

export default DiaryForm;
