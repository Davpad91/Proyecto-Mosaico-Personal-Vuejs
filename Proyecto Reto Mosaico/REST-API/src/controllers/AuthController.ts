import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { TokenObtainPair } from '../modules/TokenModule';
import { IUser, User } from '../models/UserSchema';
import { Role } from '../models/RoleSchema';
import { getErrorMessage } from '../modules/ErrorModule';
import normalizeEmail from 'normalize-email';
import { CHANNEL_SELECTOR, emitEventToClients, EVENT_SELECTOR, METHOD_SELECTOR } from '../services/WebSocketService';

export const signIn = async (req: Request, res: Response): Promise<Response> => {
	try {
		if (!req.body.email || !req.body.password) return res.status(400).json({ message: 'No se recibieron las credenciales de autenticación' });
		const user = await User.findOne({ email: normalizeEmail(req.body.email) });
		const isMatch: boolean = await user.comprobePasswords(req.body.password);
		if (isMatch) return res.status(200).json(await TokenObtainPair(user));
		return res.status(401).json({ message: 'La contraseña no es correcta' });
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const signUp = async (req: Request, res: Response): Promise<Response> => {
	try {
		req.body.role = (await Role.findOne({ name: 'Analista' }))._id;
		req.body.position = 'Analista';
		if (!req.body.nitEnterprise) {
			req.body.nitEnterprise = 19273633;
		}
		req.body.isActive = true;
		req.body.firstLogin = false;
		const user: IUser = await User.createUser(req.body);
		const newUser: IUser = await User.getUser(new ObjectId(user._id));
		emitEventToClients(newUser, `${CHANNEL_SELECTOR.user}:${EVENT_SELECTOR.change}`, CHANNEL_SELECTOR.user, null, METHOD_SELECTOR.post);	
		return res.status(201).json({ ...(await TokenObtainPair(user)) });
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};
