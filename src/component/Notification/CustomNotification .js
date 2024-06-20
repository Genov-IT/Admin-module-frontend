// Notification.js
import { notification } from 'antd';

const openNotification = (type, message, description,placement) => {
  notification[type]({
    message,
    description,
    placement   
    
  });
};

const Notification = {
  success: (message, description,placement) => openNotification('success', message, description,placement),
  info: (message, description,placement) => openNotification('info', message, description,placement),
  warning: (message, description,placement) => openNotification('warning', message, description,placement),
  error: (message, description,placement) => openNotification('error', message, description,placement),
};

export default Notification;
