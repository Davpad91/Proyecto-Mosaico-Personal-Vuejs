import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { Role, IRole } from '../models/RoleSchema';
import { getErrorMessage } from '../modules/ErrorModule';
import { CHANNEL_SELECTOR, emitEventToClients, EVENT_SELECTOR, METHOD_SELECTOR } from '../services/WebSocketService';

export const getRoles = async (_req: Request, res: Response): Promise<Response> => {
	try {
		const roles: IRole = await Role.getRoles();
		return res.status(200).json(roles);
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const getRole = async (req: Request, res: Response): Promise<Response> => {
	try {
		const role: IRole = await Role.getRole(new ObjectId(req.params.id));
		return role ? res.status(200).json(role) : res.status(404).json({ message: 'El rol no existe en el sistema' });
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const createRole = async (req: Request, res: Response): Promise<Response> => {
	try {
		const newRole: IRole = await Role.createRole(req.body);
		
		emitEventToClients(newRole, `${CHANNEL_SELECTOR.role}:${EVENT_SELECTOR.change}`, CHANNEL_SELECTOR.role, null, METHOD_SELECTOR.post);
		
		return res.status(201).json(newRole);
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const updateRole = async (req: Request, res: Response): Promise<Response> => {
	try {
		const role = await Role.findById(new ObjectId(req.params.id));
		const update: IRole = await Role.updateRole(req.body, role);
		
		emitEventToClients(update, `${CHANNEL_SELECTOR.role}:${EVENT_SELECTOR.change}`, CHANNEL_SELECTOR.role, null, METHOD_SELECTOR.patch);
		
		return res.status(200).json(update);
	} catch (error) {
		if (error instanceof Error && error.name == 'UpdateError') return res.status(400).json({ message: error.message });
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const deleteRole = async (req: Request, res: Response): Promise<Response> => {
	try {
		const role: IRole = await Role.deleteRole(new ObjectId(req.params.id));
		
		emitEventToClients(role, `${CHANNEL_SELECTOR.role}:${EVENT_SELECTOR.change}`, CHANNEL_SELECTOR.role, null, METHOD_SELECTOR.delete);
		
		return res.status(200).json(role);
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};
