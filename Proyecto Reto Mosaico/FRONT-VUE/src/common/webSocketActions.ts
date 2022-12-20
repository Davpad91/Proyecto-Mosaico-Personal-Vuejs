import { statusErrorEnums } from 'src/enums';
import {
  WebSocketResponse,
  AppNotification,
  AppNotificationAction,
} from 'src/interfaces/app';
import { notifications, tableRowActions, stringMethods } from '.';

export const modifyTableRows = (
  webSocketResponse: WebSocketResponse,
  channel: string,
  rows: any[],
  resolveOptions?: { keyToResolve: string; handle: (value: any) => any | void }
): void => {
  let notificate = true;

  switch (webSocketResponse.method) {
    case 'POST':
      tableRowActions.insertElement(
        rows,
        webSocketResponse.data,
        ['createdAt', 'updatedAt'],
        resolveOptions
      );
      break;

    case 'PUT':
    case 'PATCH':
      tableRowActions.updateRowElement(
        rows,
        webSocketResponse.id,
        webSocketResponse.data
      );
      break;

    case 'DELETE':
      tableRowActions.deleteRowElement(rows, webSocketResponse.id);
      break;

    default:
      notificate = false;
      break;
  }

  if (notificate) {
    showWebSocketSuccessMessage(
      channel,
      webSocketResponse.method,
      webSocketResponse.user
    );
  }
};

export const resolveWebSocketNotificationMessage = (
  channel: string,
  method: string,
  user?: string
): string => {
  let objectName: string;
  let actionName: string;
  let message: string;

  switch (channel) {
    case 'device':
      objectName = 'un dispositivo';
      break;

    case 'rating':
      objectName = 'una calificación';
      break;

    case 'user':
      objectName = 'un usuario';
      break;

    case 'role':
      objectName = 'un rol';
      break;

    default:
      objectName = '';
      break;
  }

  switch (method) {
    case 'POST':
      actionName = 'ha creado';
      break;

    case 'PUT':
    case 'PATCH':
      actionName = 'ha actualizado';
      break;

    case 'DELETE':
      actionName = 'ha eliminado';
      break;

    default:
      actionName = '';
      break;
  }

  if (user)
    message = `${stringMethods.toCapitalize(user)} ${actionName} ${objectName}`;
  else message = `Se ${actionName} ${objectName}`;

  return message;
};

export const resolveWebSocketNotificationColor = (method: string): string => {
  let color: string;

  switch (method) {
    case 'POST':
      color = 'green-9';
      break;

    case 'PUT':
    case 'PATCH':
      color = 'secondary';
      break;

    case 'DELETE':
      color = 'negative';
      break;

    default:
      color = 'blue-9';
      break;
  }

  return color;
};

export const resolveWebSocketNotificationActions = (
  channel: string
): AppNotificationAction[] => {
  let objectName: string;

  switch (channel) {
    case 'device':
      objectName = 'dispositivo';
      break;

    case 'rating':
      objectName = 'calificación';
      break;

    case 'user':
      objectName = 'usuario';
      break;

    case 'ver':
      objectName = 'rol';
      break;

    default:
      objectName = '';
      break;
  }

  const actions = [
    {
      label: `Ver ${objectName}`,
      color: 'white',
      handler() {
        return;
      },
    },
    {
      label: 'Cerrar',
      color: 'white',
      handler() {
        return;
      },
    },
  ];

  return actions;
};

export const resolveWebSocketNotificationIcon = (method: string): string => {
  let icon: string;

  switch (method) {
    case 'POST':
      icon = 'notification_add';
      break;

    case 'PUT':
    case 'PATCH':
    case 'DELETE':
      icon = 'notification_important';
      break;

    default:
      icon = 'notifications_active';
      break;
  }

  return icon;
};

export const showWebSocketSuccessMessage = (
  channel: string,
  method: string,
  user?: string
): void => {
  const notification: AppNotification = {
    message: resolveWebSocketNotificationMessage(channel, method, user),
    color: resolveWebSocketNotificationColor(method),
    actions: resolveWebSocketNotificationActions(channel),
    options: {
      icon: resolveWebSocketNotificationIcon(method),
      caption: 'Hace 5 minutos', //TODO: Make caption dynamic
      progress: true,
    },
  };
  notifications.showNotification(notification); //TODO: Add notifications to store
};

export const showWebSocketErrorMessage = (
  name: string,
  message: string,
  status: number
): void => {
  let captionMessage = '';
  switch (status) {
    case statusErrorEnums.statusErrorEnums.badRequest:
      captionMessage = 'Intenta iniciar sesión nuevamente';
      break;
    case statusErrorEnums.statusErrorEnums.unauthorized:
      captionMessage = 'Debes iniciar sesión nuevamente';
      break;
    case statusErrorEnums.statusErrorEnums.notFound:
      captionMessage =
        'Comuníquese con uno de los encargados del sistema o un analísta de soporte';
      break;
    case statusErrorEnums.statusErrorEnums.conflict:
      captionMessage = 'Es posible que tu usuario no exista en el sistema';
      break;
    case statusErrorEnums.statusErrorEnums.internalServerError:
      captionMessage =
        'Esto se debe a un error interno del servidor, intente recargar la página';
      break;
    default:
      captionMessage = message;
      break;
  }

  const notification: AppNotification = {
    message: `<strong>${name}:</strong> ${message}`,
    color: 'negative',
    options: {
      caption: captionMessage,
      icon: 'report_problem',
      position: 'top',
      html: true,
      timeout: 7000,
    },
  };
  notifications.showNotification(notification);
};
