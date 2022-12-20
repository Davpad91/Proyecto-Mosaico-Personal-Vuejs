import { storage, webSocketActions } from 'src/common';
import { statusErrorEnums } from 'src/enums';
import { app } from 'src/interfaces';

export const createWebSocketConnection = (
  channel: string,
  rows?: any[],
  loading?: boolean[]
): WebSocket | null => {
  const django_api_routes: string[] = ['device', 'rating'];
  let websocket_route = '';

  if (django_api_routes.includes(channel))
    websocket_route = `ws://localhost:8000/ws/api/${channel}/?token=${storage.getAccessToken()}`;

  if (websocket_route) {
    const socket: WebSocket = new WebSocket(websocket_route);

    socket.onmessage = (e: any) => {
      const messageData: app.WebSocketResponse = JSON.parse(e.data);

      if (messageData.flag != null && messageData.flag == false) {
        webSocketActions.showWebSocketErrorMessage(
          messageData.error_name || 'Error de autenticación',
          messageData.error_message ||
            'El servidor Web-Socket no pudo autenticar la conexión',
          messageData.status || statusErrorEnums.statusErrorEnums.internalServerError
        );
      } else {
        if (loading) loading[0] = true;
        setTimeout(() => {
          if (rows)
            webSocketActions.modifyTableRows(messageData, channel, rows);
          if (loading && loading[0]) loading[0] = !loading;
        }, 2000);
      }
    };

    socket.onclose = (e) => {
      if (e.code == 4004) {
        webSocketActions.showWebSocketErrorMessage(
          'Error de conexión',
          `El servidor Web-Socket ha cerrado la conexión debido que el canal ${channel} no está permitido`,
          404
        );
      }
    };

    return socket;
  }

  webSocketActions.showWebSocketErrorMessage(
    'Error de conexión',
    'El servidor Web-Socket no pudo reconocer el canal ' + channel,
    404
  );
  return null;
};

export const closeWebSocketConnection = (socket: WebSocket): void => {
  if (socket) {
    try {
      socket.close(4004);
    } catch (error) {}
  }
};
