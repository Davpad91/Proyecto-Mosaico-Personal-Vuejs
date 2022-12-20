import { node } from 'src/interfaces';
import { AxiosResponse } from 'axios';
import { node_app } from 'src/boot/axios';

export const createConfig = async (
  config: node.Config
): Promise<AxiosResponse<node.Config>> =>
  await node_app.post('/config/', config);

export const getConfig = async (
  nit: number
): Promise<AxiosResponse<node.Config>> => await node_app.get(`/config/${nit}`);

export const updateConfig = async (
  nit: number,
  config: node.Config
): Promise<AxiosResponse<node.Config>> =>
  await node_app.patch(`/config/${nit}`, config);

export const deleteConfig = async (
  nit: number
): Promise<AxiosResponse<node.Config>> =>
  await node_app.delete(`/config/${nit}`);
