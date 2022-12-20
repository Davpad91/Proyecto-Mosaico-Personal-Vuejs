import { node } from 'src/interfaces';
import { AxiosResponse } from 'axios';
import { node_app } from 'src/boot/axios';

export const signUp = async (user: node.User): Promise<AxiosResponse<node.SessionTokens>> =>
  await node_app.post('/auth/signup', user);

export const signIn = async (user: node.User): Promise<AxiosResponse<node.SessionTokens>> =>
  await node_app.post('/auth/signin', user);
