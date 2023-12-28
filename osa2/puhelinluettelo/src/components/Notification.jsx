import Message from "./Message";

const Notification = ({ successMessage, errorMessage }) => {
  if (!successMessage && !errorMessage) {
    return null;
  }

  return (
    <Message
      className={successMessage ? 'success' : 'error'}
      message={successMessage || errorMessage}
    />
  );
};

export default Notification;
