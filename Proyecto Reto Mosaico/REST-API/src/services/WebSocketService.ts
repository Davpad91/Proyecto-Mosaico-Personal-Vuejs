import http from 'http';
import { Server, Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { JwtPayload } from 'jsonwebtoken';
import * as TokenModule from '../modules/TokenModule';
import { getErrorMessage } from '../modules/ErrorModule';
import { User } from '../models/UserSchema';
import { ObjectId } from 'mongodb';
import normalizeEmail from 'normalize-email';
import { io } from '../index';

const CHANNELS = ['user', 'role'];
export const CHANNEL_SELECTOR = {
	user: 'user',
	role: 'role',
};

export const EVENT_SELECTOR = {
	change: 'change',
};

export const METHOD_SELECTOR = {
	post: 'POST',
	put: 'PUT',
	patch: 'PATCH',
	delete: 'DELETE',
};

export const getSocketClients = (): Promise<Set<string>> => {
	return io.allSockets();
};

export const emitEventToClients = async (
	data: any,
	event: string,
	channels?: string | string[],
	user_id?: string,
	method?: string
): Promise<void> => {
	const eventData = {
		user: user_id && (await User.getUser(new ObjectId(user_id))).name.split(' ')[0],
		id: data._id,
		data: data,
		method: method,
		date: Date.now(),
	};

	if (channels) {
		io.to(channels).emit(event, eventData);
		console.log(`EVENTO WEB-SOCKET '${event}' EMITIDO A LOS CANALES: ${channels}`);
	} else {
		io.emit(event, eventData);
		console.log(`EVENTO WEB-SOCKET '${event}' EMITIDO A TODOS LOS CLIENTES`);
	}
};

export const createWebSocketService = (httpServer: http.Server, corsOption: any): Server => {
	const io: Server = createSocketServer(httpServer, corsOption);
	console.log('SERVIDOR WEB-SOCKET CREADO');
	return setupSocketConnection(io);
};

const createSocketServer = (httpServer: http.Server, corsOption: any): Server => {
	return new Server(httpServer, {
		cors: corsOption,
	});
};

const setupSocketConnection = (io: Server): Server => {
	io.use(async (socket: Socket, next: (err?: ExtendedError) => void) => {
		try {
			if (!socket.handshake.auth || !socket.handshake.auth.token)
				next({
					name: 'Error de autenticación',
					message: 'El servidor Web-Socket no recibió ningún Token de acceso',
					data: { status: 400 },
				});

			if (!TokenModule.TokenVerifyAccess(socket.handshake.auth.token as string))
				next({
					name: 'Error de autenticación',
					message: 'El servidor Web-Socket recibió un Token no válido',
					data: { status: 400 },
				});

			const payload = TokenModule.TokenValidateAccessExpiration(socket.handshake.auth.token as string) as JwtPayload;
			if (!payload)
				next({
					name: 'Error de autenticación',
					message: 'El servidor Web-Socket recibió un Token expirado',
					data: { status: 401 },
				});

			const user = await User.findOne({ email: normalizeEmail(payload.email) });
			if (!user)
				next({
					name: 'Error de autenticación',
					message: 'El servidor Web-Socket recibió un Token que no pertenece a ningún usuario',
					data: { status: 409 },
				});

			next();
		} catch (error) {
			next(new Error(getErrorMessage(error)));
		}
	}).on('connection', (socket: Socket) => {
		if (socket.connected) {
			console.log(`CLIENTE WEB-SOCKET CONECTADO: ${socket.id}`);

			//------------------ Main events --------------------
			socket.on('join', async (channel: string) => {
				if (CHANNELS.includes(channel)) {
					socket.join(channel);
					if (socket.rooms.has(channel)) console.log(`CLIENTE WEB-SOCKET ${socket.id} INGRESÓ AL CANAL ${channel}`);
				}
			});

			socket.on('disconnect', () => {
				socket.disconnect(true);
				if (socket.disconnected && socket.rooms.size == 0) console.log(`CLIENTE WEB-SOCKET DESCONECTADO: ${socket.id}`);
			});

			socket.on('error', (err) => {
				console.log(err);
			});

			//------------------- Custom events -------------------
			socket.on(`${CHANNEL_SELECTOR.user}:${EVENT_SELECTOR.change}`, async (data: any) => {
				await emitEventToClients(data, `${CHANNEL_SELECTOR.user}:${EVENT_SELECTOR.change}`, CHANNEL_SELECTOR.user);
			});

			socket.on(`${CHANNEL_SELECTOR.role}:${EVENT_SELECTOR.change}`, async (data: any) => {
				await emitEventToClients(data, `${CHANNEL_SELECTOR.role}:${EVENT_SELECTOR.change}`, CHANNEL_SELECTOR.role);
			});
		}
	});

	return io;
};
