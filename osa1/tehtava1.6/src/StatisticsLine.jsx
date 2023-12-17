const StatisticsLine = ({ text, value, suffix }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
    <td>{suffix}</td>
  </tr>
);

export default StatisticsLine;
