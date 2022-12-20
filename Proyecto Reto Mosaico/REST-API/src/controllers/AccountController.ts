import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { IUser, User } from '../models/UserSchema';
import { getErrorMessage } from '../modules/ErrorModule';
import { CHANNEL_SELECTOR, emitEventToClients, EVENT_SELECTOR, METHOD_SELECTOR } from '../services/WebSocketService';

export const getAccount = async (req: Request, res: Response): Promise<Response> => {
	try {
		const user: IUser = await User.getUser(new ObjectId(req.userId));
		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const updateAccount = async (req: Request, res: Response): Promise<Response> => {
	try {
		const user = await User.findById({ _id: req.userId });
		const updatedUser = await User.updateUser(req.body, user, null);
		const userData: IUser = await User.getUser(new ObjectId(updatedUser._id));
			
		emitEventToClients(
			userData,
			`${CHANNEL_SELECTOR.user}:${EVENT_SELECTOR.change}`,
			CHANNEL_SELECTOR.user,
			null,
			METHOD_SELECTOR.patch
	)
		return res.status(200).json(userData);
	} catch (error) {
		if (error instanceof Error && error.name == 'UpdateError') return res.status(400).json({ message: error.message });
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const changePassword = async (req: Request, res: Response): Promise<Response> => {
	try {
		if (!req.body.oldpassword || !req.body.password) return res.status(400).json({ message: 'No se recibieron las claves' });
		const user = await User.findById({ _id: req.userId });
		if (!user) return res.status(400).json({ message: 'El usuario no existe en el sistema' });
		const isMatch: boolean = await user.comprobePasswords(req.body.oldpassword);
		if (isMatch) {
			await User.updateUser(req.body, user, null);
			return res.status(200).json({ message: 'Clave cambiada correctamente' });
		}
		return res.status(401).json({ message: 'La clave antigua no es correcta' });
	} catch (error) {
		if (error instanceof Error && error.name == 'UpdateError') return res.status(400).json({ message: error.message });
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const setPassword = async (req: Request, res: Response): Promise<Response> => {
	try {
		if (!req.body.password) return res.status(400).json({ message: 'No se recibió la clave' });
		const user = await User.findById({ _id: req.userId });
		if (!user) return res.status(400).json({ message: 'El usuario no existe en el sistema' });
		req.body.firstLogin = false;
		await User.updateUser(req.body, user, null);		
		return res.status(200).json({ message: 'Clave establecida correctamente' });
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};
