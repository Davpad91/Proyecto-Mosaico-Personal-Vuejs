import { Router } from 'express';
import * as ConfigController from '../controllers/ConfigController';
import { guard } from '../middlewares/index';

class ConfigRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.routes();
	}

	routes(): void {
		this.router.get('/:id', [guard.verifyToken], ConfigController.getConfig);
		this.router.post('/', [guard.verifyToken, guard.isAdminOrSuperAdmin], ConfigController.createConfig);
		this.router.patch('/:id', [guard.verifyToken, guard.isAdminOrSuperAdmin], ConfigController.updateConfig);
		this.router.delete('/:id', [guard.verifyToken, guard.isAdminOrSuperAdmin], ConfigController.deleteConfig);
	}
}

const configRouter = new ConfigRouter();
configRouter.routes();

export default configRouter.router;
