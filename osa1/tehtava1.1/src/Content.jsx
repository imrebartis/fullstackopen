const Content = ({ parts }) => (
  <div>
    {parts.map((part, index) => (
      <div key={index}>
        <p>{part.name}</p>
        <p>{part.exercises}</p>
      </div>
    ))}
  </div>
);

export default Content;
