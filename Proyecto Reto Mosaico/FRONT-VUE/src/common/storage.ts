import { app, node } from 'src/interfaces';

//------------------------- Get items -------------------------

export const getAuthenticatedUser = (): app.UserInfo | null => {
  const user: string | null = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getAccessToken = (): string | null => {
  const accesstoken: string | null = localStorage.getItem('accesstoken');
  return accesstoken ? accesstoken : null;
};

export const getRefreshToken = (): string | null => {
  const refreshtoken: string | null = localStorage.getItem('refreshtoken');
  return refreshtoken ? refreshtoken : null;
};

export const getConfig = (): node.Config | null => {
  const user: app.UserInfo | null = getAuthenticatedUser();
  return user && user.config ? user.config : null;
};

export const getNotifications = (): app.AppNotification[] | null => {
  const user: app.UserInfo | null = getAuthenticatedUser();
  return user && user.notifications ? user.notifications : null;
};

export const getNextAlert = (): app.AppNotification | null => {
  const user: app.UserInfo | null = getAuthenticatedUser();
  return user && user.nextAlert ? user.nextAlert : null;
};

//------------------------- Set items -------------------------

export const setUser = (user: app.UserInfo): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const setAccessToken = (accesstoken: string): void => {
  localStorage.setItem('accesstoken', accesstoken);
};

export const setRefreshToken = (refreshtoken: string): void => {
  localStorage.setItem('refreshtoken', refreshtoken);
};

export const setConfig = (config: node.Config): void => {
  const user: app.UserInfo | null = getAuthenticatedUser();
  if (user) {
    user.config = { ...config };
    setUser(user);
  }
};

export const setNotifications = (
  notifications: app.AppNotification[]
): void => {
  const user: app.UserInfo | null = getAuthenticatedUser();
  if (user) {
    user.notifications = [...notifications];
    setUser(user);
  }
};

export const setNextAlert = (alert: app.AppNotification): void => {
  const user: app.UserInfo | null = getAuthenticatedUser();
  if (user) {
    user.nextAlert = { ...alert };
    setUser(user);
  }
};

//------------------------- Update items -------------------------

export const updateUser = (user: node.User | app.UserInfo, keys: string[]): void => {
  const currentUser: app.UserInfo | null = getAuthenticatedUser();
  if (currentUser) {
    keys.forEach((key: string) => {
      (currentUser[key as keyof typeof currentUser] as any) =
        user[key as keyof typeof user];
    });
    setUser(currentUser);
  }
};

//------------------------- Remove items -------------------------

export const clearStorage = (): void => {
  localStorage.clear();
};

export const removeUser = (): void => {
  localStorage.removeItem('user');
};

export const removeAccessToken = (): void => {
  localStorage.removeItem('accesstoken');
};

export const removeRefreshToken = (): void => {
  localStorage.removeItem('refreshtoken');
};

export const removeNotifications = (): void => {
  const user: app.UserInfo | null = getAuthenticatedUser();
  if (user) {
    user.notifications = undefined;
    setUser(user);
  }
};

export const removeNextAlert = (): void => {
  const user: app.UserInfo | null = getAuthenticatedUser();
  if (user) {
    user.nextAlert = undefined;
    setUser(user);
  }
};
