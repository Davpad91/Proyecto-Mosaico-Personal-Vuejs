import { Notify } from 'quasar';
import { AppNotification } from 'src/interfaces/app';

export const showNotification = (notification?: AppNotification): void => {
  if (notification)
    Notify.create({
      group: (notification.options && notification.options.group) || false,
      progress:
        (notification.options && notification.options.progress) || false,
      caption: notification.options && notification.options.caption,
      position:
        (notification.options && notification.options.position) || 'top-right',
      message: notification.message,
      color: notification.color,
      actions: notification.actions,
      textColor:
        (notification.options && notification.options.textColor) || 'white',
      icon:
        (notification.options && notification.options.icon) ||
        'notifications_active',
      timeout: (notification.options && notification.options.timeout) || 5000,
      html: (notification.options && notification.options.html) || false,
    });
};

export const showSuccessNotification = (message: string): void => {
  showNotification({
    message: message,
    color: 'positive',
    options: {
      group: true,
      timeout: 3000,
      position: 'top',
      icon: 'thumb_up_alt',
    },
  } as AppNotification);
};

export const showErrorNotification = (message: string): void => {
  showNotification({
    message: message,
    color: 'negative',
    options: {
      group: true,
      timeout: 5000,
      position: 'top',
      icon: 'thumb_down_alt',
    },
  } as AppNotification);
};

export const showWarningNotification = (message: string): void => {
  showNotification({
    message: message,
    color: 'amber-13',
    options: {
      group: true,
      timeout: 5000,
      position: 'top',
      icon: 'warning',
    },
  } as AppNotification);
};
