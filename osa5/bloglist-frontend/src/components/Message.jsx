const Message = ({ message, className }) => {
  return <div className={`notification ${className}`}>{message}</div>;
};

export default Message;
