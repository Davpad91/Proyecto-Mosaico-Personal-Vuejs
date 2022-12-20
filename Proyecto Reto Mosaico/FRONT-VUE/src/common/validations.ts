import VueJwtDecode from 'vue-jwt-decode';
import { refreshToken, verifyAccess } from 'src/services/tokenService';
import { AppNotification } from 'src/interfaces/app';
import { storage } from '.';
import { AxiosResponse } from 'axios';
import { app } from 'src/interfaces';
import { statusErrorEnums } from 'src/enums';

export const isAuthenticated = async (): Promise<boolean> => {
  const accesstoken: string | null = storage.getAccessToken();
  const refreshtoken: string | null = storage.getRefreshToken();

  if (!(accesstoken && refreshtoken && storage.getAuthenticatedUser()))
	return false;

  const { exp } = VueJwtDecode.decode(accesstoken);
  if (exp - Math.floor(Date.now() / 1000) <= 120) {
	try {
	  await verifyAccess(accesstoken);
	  return true;
	} catch (err: any) {
	  if (err.response && err.response.status == statusErrorEnums.statusErrorEnums.unauthorized) {
		try {
		  const response: AxiosResponse<{ accesstoken: string }> =
			await refreshToken(refreshtoken);
		  storage.setAccessToken(response.data.accesstoken);
		  return true;
		} catch (err: any) {
		  if (err.response && err.response.status == statusErrorEnums.statusErrorEnums.unauthorized) {
			const notification: AppNotification = {
			  message:
				'Ha alcanzado el tiempo máximo de actividad, por favor inicie sesión nuevamente',
			  color: 'negative',
			  options: { icon: 'timer', position: 'top' },
			};

			storage.setNextAlert(notification);
		  } else {
			const notification: AppNotification = {
			  message: `<strong>Ha ocurrido un error de sesión:</strong> ${err.response.data.message}`,
			  color: 'negative',
			  options: {
				icon: 'report_problem',
				position: 'top',
				html: true,
			  },
			};

			storage.setNextAlert(notification);
		  }
		  return false;
		}
	  } else {
		const notification: AppNotification = {
		  message: `<strong>Ha ocurrido un error de sesión:</strong> ${err.response.data.message}`,
		  color: 'negative',
		  options: {
			icon: 'report_problem',
			position: 'top',
			html: true,
		  },
		};

		storage.setNextAlert(notification);
		return false;
	  }
	}
  }

  return true;
};

export const isAdmin = (): boolean => {
  const user: app.UserInfo | null = storage.getAuthenticatedUser();
  return user ? user.role.hierarchy == 3 : false;
};

export const isSuperAdmin = (): boolean => {
  const user: app.UserInfo | null = storage.getAuthenticatedUser();
  return user ? user.role.hierarchy == 4 : false;
};

export const isAdminOrSuperAdmin = (): boolean => {
  const user: app.UserInfo | null = storage.getAuthenticatedUser();
  return user ? user.role.hierarchy == 3 || user.role.hierarchy == 4 : false;
};

export const isLider = (): boolean => {
  const user: app.UserInfo | null = storage.getAuthenticatedUser();
  return user ? user.role.hierarchy == 2 : false;
};
