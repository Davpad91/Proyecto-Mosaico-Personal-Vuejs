import { Schema, model, Model, Document } from 'mongoose';

export interface IConfigAttr {
	nit: number;
	colorNav: string;
	colorItems: string;
	imageNavBar: string;
	tittleNavBar: string;
	modules: [];
}

export interface IConfig extends Document {
	nit: number;
	colorNav: string;
	colorItems: string;
	imageNavBar: string;
	tittleNavBar: string;
	modules: [];
}

export interface IConfigModel extends Model<IConfig> {
	build(attrs: IConfigAttr): IConfig;
	getConfig(id: number): Promise<IConfig>;
	createConfig(attrs: IConfigAttr): Promise<IConfig>;
	updateConfig(attrs: IConfigAttr, attrs2: IConfigAttr): Promise<IConfig>;
	deleteConfig(id: number): Promise<IConfig>;
}

const configSchema = new Schema(
	{
		nit: {
			type: Number,
			required: true,
		},
		colorNav: {
			type: String,
		},
		colorItems: {
			type: String,
		},
		imageNavBar: {
			type: String,
		},
		tittleNavBar: {
			type: String,
		},
		modules: {
			type: Array,
		},
	},
	{ versionKey: false, timestamps: true }
);

configSchema.statics.build = function (attrs: IConfigAttr) {
	return new Config(attrs);
};

configSchema.statics.getConfig = function (id: number) {
	return Config.findOne({ nit: id });
};

configSchema.statics.createConfig = async function (attrs: IConfigAttr) {
	const config = Config.build(attrs);
	return config.save();
};

configSchema.statics.updateConfig = function (attrs: { [key: string]: any }, attrs2: { [key: string]: any }) {
	const config = Object.keys(attrs);
	const updates: string[] = Object.keys(attrs);
	const invalidUpdates: string[] = ['_id', 'createdAt', 'updatedAt', 'nit'];
	const isNotValidOperation: boolean = updates.every((update) => invalidUpdates.includes(update));

	if (isNotValidOperation) {
		const err = new Error(`Los campos [${invalidUpdates.join(', ')}] no son actualizables`);
		err.name = 'UpdateError';
		throw err;
	}

	config.forEach((field) => {
		attrs2[field] = attrs[field];
	});
	return attrs2.save();
};

configSchema.statics.deleteConfig = function (id: number) {
	return Config.findOneAndRemove({ nit: id });
};

export const Config = model<IConfig, IConfigModel>('Config', configSchema);
