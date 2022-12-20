import { io, Socket } from 'socket.io-client';
import { storage, webSocketActions } from 'src/common';
import { app } from 'src/interfaces';

export const createWebSocketConnection = (
  channel: string,
  rows?: any[],
  loading?: boolean[]
): Socket | null => {
  const node_api_routes = ['user', 'role'];

  if (node_api_routes.includes(channel)) {
    const socket: Socket = io('http://localhost:3000/', {
      auth: { token: storage.getAccessToken() },
    });

    socket.emit('join', channel);

    socket.on('connect', () => {
      socket.on(`${channel}:change`, (data: app.WebSocketResponse) => {
        if (loading) loading[0] = true;
        setTimeout(() => {
          if (rows) webSocketActions.modifyTableRows(data, channel, rows);
          if (loading && loading[0]) loading[0] = !loading;
        }, 2000);
      });
    });

    socket.on('connect_error', (err: any) => {
      webSocketActions.showWebSocketErrorMessage(
        err.name,
        err.message,
        err.data.status
      );
    });

    return socket;
  }

  return null;
};

export const closeWebSocketConnection = (socket: Socket): void => {
  socket.disconnect();
};
