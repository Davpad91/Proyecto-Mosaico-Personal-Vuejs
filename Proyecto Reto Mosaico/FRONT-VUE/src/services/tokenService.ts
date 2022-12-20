import { AxiosResponse } from 'axios';
import { node_app } from 'src/boot/axios';
import { node } from 'src/interfaces';

export const refreshToken = async (
  refreshToken: string
): Promise<AxiosResponse<node.SessionAccessToken>> =>
  await node_app.post('/token/refresh', { refreshtoken: refreshToken });

export const verifyAccess = async (
  accessToken: string
): Promise<AxiosResponse<node.ResponseMessage>> =>
  await node_app.post('/token/verify/access', { accesstoken: accessToken });

export const verifyRefresh = async (
  refreshToken: string
): Promise<AxiosResponse<node.ResponseMessage>> =>
  await node_app.post('/token/verify/refresh', { refreshtoken: refreshToken });
