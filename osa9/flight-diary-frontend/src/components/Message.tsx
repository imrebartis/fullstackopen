import { useEffect } from 'react';

export type MessageType = 'error' | 'success';

interface MessageProps {
  message: string | null
  type: MessageType
  duration?: number
  onDismiss: () => void
}

const Message: React.FC<MessageProps> = ({
  message,
  type,
  duration = 5000,
  onDismiss
}) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return <p className={`${type}-message`}>{message}</p>;
};

export default Message;
