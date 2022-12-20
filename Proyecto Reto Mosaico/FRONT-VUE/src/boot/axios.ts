import axios, { AxiosInstance } from 'axios';
import { Service } from 'axios-middleware';
import AuthMiddleware from './axios.middlewares';

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$axios: AxiosInstance;
	}
}

const node_app: AxiosInstance = axios.create({
	baseURL: 'http://localhost:3000',
	headers: {
		'content-type': 'application/json',
	},
	withCredentials: true,
});

const django_app: AxiosInstance = axios.create({
	baseURL: 'http://localhost:8000/api',
	headers: {
		'content-type': 'application/json',
	},
});

const nodeAppMiddleware = new Service(node_app);
const djangoAppMiddleware = new Service(django_app);
nodeAppMiddleware.register(new AuthMiddleware());
djangoAppMiddleware.register(new AuthMiddleware());

export { node_app, django_app };
