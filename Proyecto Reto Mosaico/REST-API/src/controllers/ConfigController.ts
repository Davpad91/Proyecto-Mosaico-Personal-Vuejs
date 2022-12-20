import { Request, Response } from 'express';
import { Config, IConfig } from '../models/ConfigSchema';
import { getErrorMessage } from '../modules/ErrorModule';

export const getConfig = async (req: Request, res: Response): Promise<Response> => {
	try {
		const config: IConfig = await Config.getConfig(Number(req.params.id));
		return config ? res.status(200).json(config) : res.status(404).json({ message: 'El NIT de la empresa no existe en el sistema' });
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const createConfig = async (req: Request, res: Response): Promise<Response> => {
	try {
		const newConfig: IConfig = await Config.createConfig(req.body);
		return res.status(201).json(newConfig);
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const updateConfig = async (req: Request, res: Response): Promise<Response> => {
	try {
		const config = await Config.findOne({ nit: req.params.id });
		if (!config) return res.status(404).json({ message: 'El NIT de la empresa no existe en el sistema' });
		const update: IConfig = await Config.updateConfig(req.body, config);
		return res.status(200).json(update);
	} catch (error) {
		if (error instanceof Error && error.name == 'UpdateError') return res.status(400).json({ message: error.message });
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const deleteConfig = async (req: Request, res: Response): Promise<Response> => {
	try {
		const config: IConfig = await Config.deleteConfig(Number(req.params.id));
		return res.status(200).json(config);
	} catch (error) {
		return res.status(500).json({ message: getErrorMessage(error) });
	}
};
