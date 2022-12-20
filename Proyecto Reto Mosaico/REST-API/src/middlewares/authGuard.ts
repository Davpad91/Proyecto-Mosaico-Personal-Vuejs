import { NextFunction, Request, Response } from 'express';
import { TokenVerifyAccess, TokenValidateAccessExpiration } from '../modules/TokenModule';
import { User } from '../models/UserSchema';
import { Role } from '../models/RoleSchema';
import { JwtPayload } from 'jsonwebtoken';
import { getErrorMessage } from '../modules/ErrorModule';
import normalizeEmail from 'normalize-email';

export const userAlreadyExists = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
	try {
		if (await User.findOne({ idCard: req.body.idCard })) {
			return res.status(400).json({ message: 'Ya existe un usuario con este número de identificación' });
		}

		if (await User.findOne({ email: normalizeEmail(req.body.email) })) {
			return res.status(400).json({ message: 'Ya existe un usuario con este email' });
		}

		return next();
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
	try {
		if (!req.header('Authorization')) return res.status(400).json({ message: 'El Header Authorization ha llegado vacío' });

		const token = req.header('Authorization').replace('Bearer ', '');
		if (!token) return res.status(400).json({ message: 'No se recibió ningún Token de autenticación' });
		if (!TokenVerifyAccess(token)) return res.status(400).json({ message: 'El Token no es válido' });

		const payload = TokenValidateAccessExpiration(token) as JwtPayload;
		if (!payload) return res.status(401).json({ message: 'El Token ha expirado' });

		const user = await User.findOne({ email: normalizeEmail(payload.email) });
		if (!user) return res.status(409).json({ message: 'El Token no pertenece a ningún usuario' });

		req.userId = user.id;
		return next();
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const isActive = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
	try {
		const user = await User.findOne({ email: normalizeEmail(req.body.email) });
		if (!user) return res.status(400).json({ message: 'El usuario no existe en el sistema' });
		if (user.isActive) return next();
		return res.status(403).json({ message: 'El usuario no está habilitado' });
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
	try {
		const user = await User.findById({ _id: req.userId });
		const role = await Role.findById({ _id: user.role });
		if (role.hierarchy == 3) return next();
		return res.status(403).json({ message: 'No tiene permisos para ejecutar esta acción' });
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};
export const isSuperAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
	try {
		const user = await User.findById({ _id: req.userId });
		const role = await Role.findById({ _id: user.role });
		if (role.hierarchy == 4) return next();
		return res.status(403).json({ message: 'No tiene permisos para ejecutar esta acción' });
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const isAnalyst = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
	try {
		const user = await User.findById({ _id: req.userId });
		const role = await Role.findById({ _id: user.role });
		if (role.hierarchy == 1) return next();
		return res.status(403).json({ message: 'No tiene permisos para ejecutar esta acción' });
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};
export const isLeader = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
	try {
		const user = await User.findById({ _id: req.userId });
		const role = await Role.findById({ _id: user.role });
		if (role.hierarchy == 3) return next();
		return res.status(403).json({ message: 'No tiene permisos para ejecutar esta acción' });
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const isLeaderOrAdminOrSuperAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
	try {
		const user = await User.findById({ _id: req.userId });
		const role = await Role.findOne({ _id: user.role });
		if ([2, 3, 4].includes(role.hierarchy)) return next();
		return res.status(403).json({ message: 'No tiene permisos para ejecutar esta acción' });
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const isAdminOrSuperAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
	try {
		const user = await User.findById({ _id: req.userId });
		const role = await Role.findOne({ _id: user.role });
		if ([3, 4].includes(role.hierarchy)) return next();
		return res.status(403).json({ message: 'No tiene permisos para ejecutar esta acción' });
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};
