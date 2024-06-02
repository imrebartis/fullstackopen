const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className="error" style={{ color: "red" }}>
      {message}
    </div>
  );
};

export default Notification;
