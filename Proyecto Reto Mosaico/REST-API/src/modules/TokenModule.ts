import config from '../config/config';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/UserSchema';
import { Role } from '../models/RoleSchema';

interface IUserData {
	id: any;
	name: string;
	email: string;
	idCard: number;
	phone: number;
	question1: string;
	question2: string;
	question3: string;
	question4: string;
	hierarchy: number;
	nit: number;
	role: {
		_id: string | number;
		id: string | number;
		name: string;
		description: string;
		hierarchy: number;
	};
}

const DataUser = async (user: IUser): Promise<IUserData> => {
	const role = await Role.getRole(user.role);
	const userParams: IUserData = {
		id: user._id,
		name: user.name,
		email: user.email,
		idCard: user.idCard,
		phone: user.phone,
		question1: user.question1,
		question2: user.question2,
		question3: user.question3,
		question4: user.question4,
		hierarchy: role.hierarchy,
		nit: user.nitEnterprise,
		role: {
			_id: role._id,
			id: role.id,
			name: role.name,
			description: role.description,
			hierarchy: role.hierarchy,
		},
	};

	return userParams;
};

export const TokenObtainPair = async (user: IUser): Promise<{ accesstoken: string; refreshtoken: string }> => {
	return {
		accesstoken: jwt.sign(await DataUser(user), config.secret, {
			expiresIn: config.expiresIn,
		}),
		refreshtoken: jwt.sign(await DataUser(user), config.refresh_secret, {
			expiresIn: config.refresh_expiresIn,
		}),
	};
};

export const TokenObtainAccess = async (user: IUser): Promise<{ accesstoken: string }> => {
	return {
		accesstoken: jwt.sign(await DataUser(user), config.secret, {
			expiresIn: config.expiresIn,
		}),
	};
};

export const TokenVerifyAccess = (token: string): boolean => {
	let valid: boolean = true;
	jwt.verify(token, config.secret, (err, _decoded) => {
		if (err && err.name == 'JsonWebTokenError') valid = false;
	});
	return valid;
};

export const TokenVerifyRefresh = (token: string): boolean => {
	let valid: boolean = true;
	jwt.verify(token, config.refresh_secret, (err, _decoded) => {
		if (err && err.name == 'JsonWebTokenError') valid = false;
	});
	return valid;
};

export const TokenValidateAccessExpiration = (token: string): string | jwt.JwtPayload => {
	let payload: string | jwt.JwtPayload | null;
	jwt.verify(token, config.secret, (err, decoded) => {
		if (err && err.name == 'TokenExpiredError') payload = null;
		else payload = decoded;
	});
	return payload;
};

export const TokenValidateRefreshExpiration = (token: string): string | jwt.JwtPayload => {
	let payload: string | jwt.JwtPayload | null;
	jwt.verify(token, config.refresh_secret, (err, decoded) => {
		if (err && err.name == 'TokenExpiredError') payload = null;
		else payload = decoded;
	});
	return payload;
};
