const ErrorMessage = ({ message }) => {
  return (
    <div style={{ color: 'red', fontWeight: 'bold' }}>
      Failed to fetch {message} data!
    </div>
  );
};

export default ErrorMessage;
