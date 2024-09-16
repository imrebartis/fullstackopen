const Error = ({ error }: { error: string }) => {
  return <div style={{ color: 'red' }}>{error}</div>;
};

export default Error;
