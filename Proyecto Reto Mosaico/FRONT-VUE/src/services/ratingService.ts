import { AxiosResponse } from 'axios';
import { django_app } from 'src/boot/axios';
import { django } from 'src/interfaces';

export const getRatings = async (): Promise<AxiosResponse<django.Rating[]>> =>
  await django_app.get('/rating/');
