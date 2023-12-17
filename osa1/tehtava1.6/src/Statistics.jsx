import StatisticsLine from './StatisticsLine';

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = (good - bad) / total;
  const positive = (good / total) * 100;

  if (good === 0 && neutral === 0 && bad === 0) {
    return (
      <>
        <p>No feedback given</p>
      </>
    );
  }
  return (
    <table>
      <tbody>
        <StatisticsLine text='good' value={good} />
        <StatisticsLine text='neutral' value={neutral} />
        <StatisticsLine text='bad' value={bad} />
        <StatisticsLine text='all' value={total} />
        <StatisticsLine text='average' value={average} />
        <StatisticsLine text='positive' value={positive} suffix='%' />
      </tbody>
    </table>
  );
};

export default Statistics;
