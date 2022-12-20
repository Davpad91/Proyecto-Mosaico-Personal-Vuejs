import { Schema, model, Document, Model } from 'mongoose';
import normalizeEmail from 'normalize-email';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

export interface IUserAttrs {
	name: string;
	idCard: number;
	email: string;
	phone: number;
	password: string;
	role: ObjectId;
	nitEnterprise: number;
	question1: string;
	question2: string;
	question3: string;
	question4: string;
	answer1: string;
	answer2: string;
	answer3: string;
	answer4: string;
	isActive: boolean;
	firstLogin: boolean;
}

export interface IUser extends Document {
	name: string;
	idCard: number;
	email: string;
	phone: number;
	password: string;
	role: ObjectId;
	nitEnterprise: number;
	question1: string;
	question2: string;
	question3: string;
	question4: string;
	answer1: string;
	answer2: string;
	answer3: string;
	answer4: string;
	isActive: boolean;
	firstLogin: boolean;
	comprobePasswords: (password: string) => Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {
	build(attrs: IUserAttrs): IUser;
	getUsers(): Promise<IUser>;
	getUser(id: ObjectId): Promise<IUser>;
	createUser(attrs: IUserAttrs): Promise<IUser>;
	updateUser(attrs: IUserAttrs, attrs2: IUserAttrs, invalidUpdates: string[] | null): Promise<IUser>;
}

const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		idCard: {
			type: Number,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true,
			required: true,
		},
		phone: {
			type: Number,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: ObjectId,
			ref: 'Role',
		},
		position: {
			type: String,
			required: true,
		},
		nitEnterprise: {
			type: Number,
			ref: 'Config',
		},
		isActive: {
			type: Boolean,
			required: true,
		},
		firstLogin: {
			type: Boolean,
			required: false,
		},
		question1: {
			type: String,
		},
		question2: {
			type: String,
		},
		question3: {
			type: String,
		},
		question4: {
			type: String,
		},
		answer1: {
			type: String,
		},
		answer2: {
			type: String,
		},
		answer3: {
			type: String,
		},
		answer4: {
			type: String,
		},
	},
	{ versionKey: false, timestamps: true }
);

UserSchema.methods.comprobePasswords = async function (password: string): Promise<Boolean> {
	const schema = this;
	return await bcrypt.compare(password, schema.password);
};

UserSchema.pre<IUser>('save', async function (next) {
	const schema = this;

	if (schema.isModified('name')) {
		schema.name = schema.name.trim();
	}

	if (schema.isModified('email')) {
		schema.email = schema.email.trim();
		schema.email = normalizeEmail(schema.email);
	}

	if (schema.isModified('password')) {
		schema.password = schema.password.trim();
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(schema.password, salt);
		schema.password = hash;
	}

	for (let i = 0; i < 4; i++) {
		let answer = ['answer1', 'answer2', 'answer3', 'answer4'][i];
		if (schema.isModified(answer)) {
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(schema.get(answer).trim().toLowerCase(), salt);
			schema.set(answer, hash);
		}
	}

	next();
});

UserSchema.statics.build = function (attrs: IUserAttrs) {
	return new User(attrs);
};

UserSchema.statics.getUsers = function () {
	return User.find().select('-password -answer1 -answer2 -answer3 -answer4').populate('role');
};

UserSchema.statics.getUser = function (id: ObjectId) {
	return User.findById({ _id: id }).select('-password -answer1 -answer2 -answer3 -answer4').populate('role');
};

UserSchema.statics.createUser = async function (attrs: IUserAttrs) {
	const user = User.build(attrs);
	return user.save();
};

UserSchema.statics.updateUser = function (attrs: { [key: string]: any }, attrs2: { [key: string]: any }, invalidUpdates: string[] | null) {
	const user = Object.keys(attrs);
	const updates: string[] = Object.keys(attrs);

	if (!invalidUpdates) invalidUpdates = ['_id', 'createdAt', 'updatedAt', 'name', 'email', 'idCard', 'role', 'position', 'isActive'];
	const isNotValidOperation: boolean = updates.every((update) => invalidUpdates.includes(update));

	if (isNotValidOperation) {
		const err = new Error(`Los campos [${invalidUpdates.join(', ')}] no son actualizables`);
		err.name = 'UpdateError';
		throw err;
	}

	user.forEach((field) => {
		attrs2[field] = attrs[field];
	});

	return attrs2.save();
};

export const User = model<IUser, IUserModel>('User', UserSchema);
