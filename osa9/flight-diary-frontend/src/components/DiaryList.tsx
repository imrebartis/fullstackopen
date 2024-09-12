import React, { useMemo } from 'react';
import { DiaryEntry } from '../types';

interface DiaryListProps {
  diaries: DiaryEntry[];
}

const DiaryList: React.FC<DiaryListProps> = ({ diaries }) => {
  const memoizedDiaryList = useMemo(() => {
    if (diaries.length === 0) {
      return <p>No diary entries available.</p>;
    }

    return (
      <ul className="diary-list">
        {diaries.map((diary) => (
          <li className="diary-item" key={diary.id}>
            <p>
              <b>Date: {diary.date}</b>
            </p>
            <p>Visibility: {diary.visibility}</p>
            <p>Weather: {diary.weather}</p>
            {diary.comment && <p>Comment: {diary.comment}</p>}
            <br />
          </li>
        ))}
      </ul>
    );
  }, [diaries]);

  return (
    <>
      <h2>Diary entries</h2>
      {memoizedDiaryList}
    </>
  );
};

export default DiaryList;
