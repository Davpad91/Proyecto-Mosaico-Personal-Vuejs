import { Request, Response } from 'express';
import * as TokenModule from '../modules/TokenModule';
import { User } from '../models/UserSchema';
import { JwtPayload } from 'jsonwebtoken';
import { getErrorMessage } from '../modules/ErrorModule';
import normalizeEmail from 'normalize-email';

export const refreshAccessToken = async (req: Request, res: Response): Promise<Response> => {
	try {
		if (!req.header('Authorization')) return res.status(400).json({ message: 'El Header Authorization ha llegado vacío' });

		const refreshtoken = req.body.refreshtoken;
		if (!refreshtoken) return res.status(400).json({ message: 'No se recibió ningún Token' });
		if (!TokenModule.TokenVerifyRefresh(refreshtoken)) return res.status(400).json({ message: 'El Token no es válido' });

		const payload = TokenModule.TokenValidateRefreshExpiration(refreshtoken) as JwtPayload;
		if (!payload) return res.status(401).json({ message: 'El Token ha expirado' });

		const user = await User.findOne({ email: normalizeEmail(payload.email) });
		if (!user) return res.status(409).json({ message: 'El Token no pertenece a ningún usuario' });

		req.body = { accesstoken: (await TokenModule.TokenObtainAccess(user)).accesstoken };
		return res.status(202).json(req.body);
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const validateAccessToken = async (req: Request, res: Response): Promise<Response> => {
	try {
		const accesstoken = req.body.accesstoken;
		if (!accesstoken) return res.status(400).json({ message: 'No se recibió ningún Token de autenticación' });
		if (!TokenModule.TokenVerifyAccess(accesstoken)) return res.status(400).json({ message: 'El Token no es válido' });

		const payload = TokenModule.TokenValidateAccessExpiration(accesstoken) as JwtPayload;
		if (!payload) return res.status(401).json({ message: 'El Token ha expirado' });

		const user = await User.findOne({ email: normalizeEmail(payload.email) });
		if (!user) return res.status(409).json({ message: 'Su perfil no ha sido encontrado en el sistema' });

		return res.status(202).json({ message: 'El Token es válido y se encuentra vigente' });
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const validateRefreshToken = async (req: Request, res: Response): Promise<Response> => {
	try {
		const refreshtoken = req.body.refreshtoken;
		if (!refreshtoken) return res.status(400).json({ message: 'No se recibió ningún Token de autenticación' });
		if (!TokenModule.TokenVerifyRefresh(refreshtoken)) return res.status(400).json({ message: 'El Token no es válido' });

		const payload = TokenModule.TokenValidateRefreshExpiration(refreshtoken) as JwtPayload;
		if (!payload) return res.status(401).json({ message: 'El Token ha expirado' });

		const user = await User.findOne({ email: normalizeEmail(payload.email) });
		if (!user) return res.status(409).json({ message: 'Su perfil no ha sido encontrado en el sistema' });

		return res.status(202).json({ message: 'El Token es válido y se encuentra vigente' });
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};
