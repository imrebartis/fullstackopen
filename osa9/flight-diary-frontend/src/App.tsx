import { useState, useEffect, useCallback } from 'react';
import useDiaries from './hooks/useDiaries';
import DiaryForm from './components/DiaryForm';
import DiaryList from './components/DiaryList';
import Message, { MessageType } from './components/Message';
import Loading from './components/Loading';
import './App.css';
import { NewDiaryEntry } from './types';

interface MessageData {
  text: string
  type: MessageType
}

const App = () => {
  const { diaries, error, loading, handleCreateDiary, clearError } =
    useDiaries();
  const [message, setMessage] = useState<MessageData | null>(null);

  useEffect(() => {
    if (error) {
      setMessage({ text: error, type: 'error' });
    }
  }, [error]);

  const handleDismissMessage = useCallback(() => {
    setMessage(null);
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  const handleSubmit = async (diary: NewDiaryEntry) => {
    await handleCreateDiary(diary);
    setMessage({ text: 'New diary entry created!', type: 'success' });
  };

  return (
    <div>
      {message && (
        <Message
          message={message.text}
          type={message.type}
          onDismiss={handleDismissMessage}
        />
      )}
      {loading ? (
        <Loading />
      ) : (
        <>
          <DiaryForm onSubmit={handleSubmit} />
          <DiaryList diaries={diaries} />
        </>
      )}
    </div>
  );
};

export default App;
