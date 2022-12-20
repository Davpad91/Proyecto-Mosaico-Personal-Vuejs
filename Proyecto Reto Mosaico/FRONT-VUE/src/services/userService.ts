import { node } from 'src/interfaces';
import { AxiosResponse } from 'axios';
import { node_app } from 'src/boot/axios';

export const getUsers = async (): Promise<AxiosResponse<node.User[]>> =>
  await node_app.get('/user');

export const createUser = async (
  user: node.User
): Promise<AxiosResponse<node.User>> => await node_app.post('/user', user);

export const getUser = async (id: string): Promise<AxiosResponse<node.User>> =>
  await node_app.get(`/user/${id}`);

export const updateUser = async (
  user: node.User
): Promise<AxiosResponse<node.User>> =>
  await node_app.patch(`/user/${user.id}`, user);
