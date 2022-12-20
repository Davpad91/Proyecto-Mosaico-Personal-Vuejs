import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IRoleAttr {
	name: string;
	description: string;
	hierarchy: number;
}

export interface IRole extends Document {
	name: string;
	description: string;
	hierarchy: number;
}

export interface IRoleModel extends Model<IRole> {
	build(attrs: IRoleAttr): IRole;
	getRoles(): Promise<IRole>;
	getRole(id: ObjectId): Promise<IRole>;
	createRole(attrs: IRoleAttr): Promise<IRole>;
	updateRole(attrs: IRoleAttr, attrs2: IRoleAttr): Promise<IRole>;
	deleteRole(id: ObjectId): Promise<IRole>;
}

const rolSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		hierarchy: {
			type: Number,
			required: true,
		},
	},
	{ versionKey: false, timestamps: true }
);

rolSchema.statics.build = function (attrs: IRoleAttr) {
	return new Role(attrs);
};

rolSchema.statics.createRole = async function (attrs: IRoleAttr) {
	const role = Role.build(attrs);
	return role.save();
};

rolSchema.statics.getRoles = function () {
	return Role.find();
};

rolSchema.statics.getRole = function (id: ObjectId) {
	return Role.findById({ _id: id });
};

rolSchema.statics.updatRole = function (attrs: { [key: string]: any }, attrs2: { [key: string]: any }) {
	const role = Object.keys(attrs);
	const updates: string[] = Object.keys(attrs);
	const invalidUpdates: string[] = ['_id', 'createdAt', 'updatedAt'];
	const isNotValidOperation: boolean = updates.every((update) => invalidUpdates.includes(update));
	
	if (isNotValidOperation) {
		const err = new Error(`Los campos [${invalidUpdates.join(', ')}] no son actualizables`);
		err.name = 'UpdateError';
		throw err;
	}

	role.forEach((field) => {
		attrs2[field] = attrs[field];
	});
	return attrs2.save();
};

rolSchema.statics.deleteRole = function (id: ObjectId) {
	return Role.findByIdAndRemove({ _id: id });
};

export const Role = model<IRole, IRoleModel>('Role', rolSchema);
