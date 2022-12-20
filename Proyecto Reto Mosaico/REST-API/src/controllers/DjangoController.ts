import { Request, Response } from 'express';
import { Role } from '../models/RoleSchema';
import { User } from '../models/UserSchema';

const superAdminHierarchy = 4;

export const getAuthenticatedUser = async (req: Request, res: Response): Promise<Response> => {
	const user = await User.findById({ _id: req.userId });
	return res.status(202).json({ email: user.email });
};

export const getAuthenticatedUserWithRole = async (req: Request, res: Response): Promise<Response> => {
	const user = await User.findById({ _id: req.userId });
	const role = await Role.findById({ _id: user.role });
	return res.status(202).json({ email: user.email, isSuperAdmin: role.hierarchy == superAdminHierarchy });
};
