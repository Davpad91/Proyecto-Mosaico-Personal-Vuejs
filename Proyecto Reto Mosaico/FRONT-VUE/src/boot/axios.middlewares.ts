import axios from 'axios';
import { storage } from 'src/common';
import { TokenService } from 'src/services';
import {statusErrorEnums} from 'src/enums/'

const isExcludedRoute = (url: string) => {
  return !['auth', 'token'].includes(url.split('/')[1]);
};

export default class AuthMiddleware {
  onRequest(config: any) {
    config.headers.Authorization = `Bearer ${storage.getAccessToken()}`;
    return config;
  }

  onSync(promise: any) {
    return promise;
  }

  onResponse(response: any) {
    return response;
  }

  async onResponseError(err: any) {
    if (
      err.response.status == statusErrorEnums.statusErrorEnums.unauthorized &&
      isExcludedRoute(err.response.config.url)
    ) {
      const config = err.config;
      const refreshToken = storage.getRefreshToken();
      if (!refreshToken) return;

      try {
        const response = await TokenService.refreshToken(refreshToken);
        const { accesstoken } = response.data;
        storage.setAccessToken(accesstoken);
        config.headers.Authorization = `Bearer ${accesstoken}`;

        return await axios(config);
      } catch (err: any) {
        throw err;
      }
    }
    throw err;
  }
}
