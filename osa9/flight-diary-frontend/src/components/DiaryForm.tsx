import useForm from '../hooks/useForm';
import { NewDiaryEntry, Weather, Visibility } from '../types';

const DiaryForm: React.FC<{ onSubmit: (diary: NewDiaryEntry) => void }> = ({
  onSubmit
}) => {
  const { form, handleChange, resetForm } = useForm({
    date: '',
    visibility: Visibility.Great,
    weather: Weather.Sunny,
    comment: ''
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(form);
    resetForm();
  };

  return (
    <>
      <h2>Add new entry</h2>
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
          {Object.values(Visibility).map((v) => (
            <label key={v}>
              <input
                type='radio'
                name='visibility'
                value={v}
                checked={form.visibility === v}
                onChange={handleChange}
              />
              {v}
            </label>
          ))}
        </div>
        <div>
          <label>Weather:</label>
          {Object.values(Weather).map((w) => (
            <label key={w}>
              <input
                type='radio'
                name='weather'
                value={w}
                checked={form.weather === w}
                onChange={handleChange}
              />
              {w}
            </label>
          ))}
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
    </>
  );
};

export default DiaryForm;
