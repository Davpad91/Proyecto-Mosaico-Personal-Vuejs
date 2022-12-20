import { AxiosResponse } from 'axios';
import { django_app } from 'src/boot/axios';
import { django } from 'src/interfaces';

export const getDevices = async (): Promise<AxiosResponse<django.Device[]>> =>
  await django_app.get('/device/');

export const createDevice = async (
  device: django.Device
): Promise<AxiosResponse<django.Device>> =>
  await django_app.post('/device/', device);

export const getDeviceById = async (
  id: number
): Promise<AxiosResponse<django.Device>> =>
  await django_app.get(`device/${id}/`);

export const getDeviceByEmail = async (
  email: string
): Promise<AxiosResponse<django.Device>> =>
  await django_app.get(`device/retrieve_by_email/?user=${email}`);

export const updateDevice = async (
  device: django.Device
): Promise<AxiosResponse<django.Device>> =>
  await django_app.patch(`device/${device.id}/`, device);
