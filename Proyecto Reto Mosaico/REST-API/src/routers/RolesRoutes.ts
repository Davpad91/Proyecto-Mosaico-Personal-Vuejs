import { Router } from 'express';
import * as RoleController from '../controllers/RoleController';
import { guard } from '../middlewares/index';

class RoleRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.routes();
	}

	routes(): void {
		this.router.get('/', [guard.verifyToken, guard.isSuperAdmin], RoleController.getRoles);
		this.router.get('/:id', [guard.verifyToken, guard.isSuperAdmin], RoleController.getRole);
		this.router.post('/', [guard.verifyToken, guard.isSuperAdmin], RoleController.createRole);
		this.router.patch('/:id', [guard.verifyToken, guard.isSuperAdmin], RoleController.updateRole);
		this.router.delete('/:id', [guard.verifyToken, guard.isSuperAdmin], RoleController.deleteRole);
	}
}

const roleRouter = new RoleRouter();
roleRouter.routes();

export default roleRouter.router;
