import { useEffect } from 'react';
import useDiaries from './hooks/useDiaries';
import DiaryForm from './components/DiaryForm';
import DiaryList from './components/DiaryList';
import ErrorMessage from './components/ErrorMessage';
import Loading from './components/Loading';
import './App.css';

const App = () => {
  const { diaries, error, loading, handleCreateDiary, clearError } = useDiaries();
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
    <div>
      <ErrorMessage message={error} />
      {loading ? (
        <Loading />
      ) : (
        <>
          <DiaryForm onSubmit={handleCreateDiary} />
          <DiaryList diaries={diaries} />
        </>
      )}
    </div>
  );
};

export default App;
