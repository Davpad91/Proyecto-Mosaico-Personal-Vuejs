import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { IUser, User } from '../models/UserSchema';
import { Role } from '../models/RoleSchema';
import { getErrorMessage } from '../modules/ErrorModule';
import { CHANNEL_SELECTOR, emitEventToClients, EVENT_SELECTOR, METHOD_SELECTOR } from '../services/WebSocketService';

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
	try {
		const user = await User.findById({ _id: req.userId });
		const role = await Role.findById({ _id: user.role });

		if ([3, 4].includes(role.hierarchy)) {
			const users: IUser = await User.getUsers();
			return res.status(200).json(users);
		} else if (role.hierarchy == 2) {
			const { _id } = await Role.findOne({ name: 'Analista' });
			const users = await User.find({ role: _id }).select('-password -answer1 -answer2 -answer3 -answer4');
			return res.status(200).json(users);
		}
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const getUser = async (req: Request, res: Response): Promise<Response> => {
	try {
		const user: IUser = await User.getUser(new ObjectId(req.params.id));
		return user ? res.status(200).json(user) : res.status(404).json({ message: 'El usuario no existe en el sistema' });
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const createUser = async (req: Request, res: Response): Promise<Response> => {
	try {
		if (req.body.role) req.body.role = (await Role.findOne({ name: req.body.role }))._id;
		else req.body.role = (await Role.findOne({ name: 'Analista' }))._id;

		if (!req.body.position) req.body.position = 'Analista';

		req.body.isActive = true;
		req.body.firstLogin = true;

		const user: IUser = await User.createUser(req.body);
		const newUser: IUser = await User.getUser(new ObjectId(user._id));

		emitEventToClients(
			newUser,
			`${CHANNEL_SELECTOR.user}:${EVENT_SELECTOR.change}`,
			CHANNEL_SELECTOR.user,
			req.userId,
			METHOD_SELECTOR.post
		);

		return res.status(201).json(newUser);
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
	try {
		let invalidUpdates: string[] = ['_id', 'createdAt', 'updatedAt', 'email', 'idCard'];
		const user = await User.findById(new ObjectId(req.params.id));
		const updatedUser: IUser = await User.updateUser(req.body, user, invalidUpdates);
		const userData: IUser = await User.getUser(new ObjectId(updatedUser._id));

		emitEventToClients(
			userData,
			`${CHANNEL_SELECTOR.user}:${EVENT_SELECTOR.change}`,
			CHANNEL_SELECTOR.user,
			req.userId,
			METHOD_SELECTOR.patch
		);

		return res.status(200).json(userData);
	} catch (error) {
		if (error instanceof Error && error.name == 'UpdateError') return res.status(400).json({ message: error.message });
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};
