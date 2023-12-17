import { useState } from 'react';
import Button from './Button';
import Statistics from './Statistics';
import Header from './Header';

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1);
  };

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  };

  const handleBadClick = () => {
    setBad(bad + 1);
  };

  return (
    <>
      <>
        <Header text='give feedback' />
        <Button handleClick={handleGoodClick} text='good' />
        <Button handleClick={handleNeutralClick} text='neutral' />
        <Button handleClick={handleBadClick} text='bad' />
      </>
      <>
        <Header text='statistics' />
        <Statistics good={good} neutral={neutral} bad={bad} />
      </>
    </>
  );
};

export default App;
