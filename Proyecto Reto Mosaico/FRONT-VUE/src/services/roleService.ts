import { node } from 'src/interfaces';
import { AxiosResponse } from 'axios';
import { node_app } from 'src/boot/axios';

export const getRoles = async (): Promise<AxiosResponse<node.Role[]>> =>
  await node_app.get('/role');
