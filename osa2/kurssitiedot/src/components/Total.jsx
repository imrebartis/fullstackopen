const Total = ({ parts }) => {
  const total = parts.reduce((acc, cur) => acc + cur.exercises, 0);

  return (
    <p>
      <strong>Total of {total} exercises</strong>
    </p>
  );
};
export default Total;
