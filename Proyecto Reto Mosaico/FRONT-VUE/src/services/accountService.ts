import { node } from 'src/interfaces';
import { AxiosResponse } from 'axios';
import { node_app } from 'src/boot/axios';

export const getUser = async (): Promise<AxiosResponse<node.User>> =>
  await node_app.get('/account');

export const updateUser = async (user: node.UserUpdate): Promise<AxiosResponse<node.User>> =>
  await node_app.patch('/account/update', user);

export const changePassword = async (
  newPassword: node.NewPassword
): Promise<AxiosResponse<node.ResponseMessage>> =>
  await node_app.patch('/account/changepassword', newPassword);
