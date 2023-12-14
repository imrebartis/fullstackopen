const Total = ({ part1, part2, part3 }) => {
  const total = part1.exercises + part2.exercises + part3.exercises;
  return <p>Number of exercises {total}</p>;
};

export default Total;
