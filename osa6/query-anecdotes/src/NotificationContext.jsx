import { createContext, useReducer, useContext, useCallback } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.payload;
    case "CLEAR_NOTIFICATION":
      return null;
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  );
  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationValue = () => {
  const [notification] = useContext(NotificationContext);
  return notification;
};

export const useNotificationDispatch = () => {
  const [, notificationDispatch] = useContext(NotificationContext);

  const dispatchWithTimeout = useCallback(
    (payload) => {
      notificationDispatch({ type: "SET_NOTIFICATION", payload });
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR_NOTIFICATION" });
      }, 5000);
    },
    [notificationDispatch]
  );

  return dispatchWithTimeout;
};

export default NotificationContext;
