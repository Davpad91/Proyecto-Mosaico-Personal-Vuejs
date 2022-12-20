import { Router } from 'express';
import * as DjangoController from '../controllers/DjangoController';
import { guard } from '../middlewares';

class DjangoRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.routes();
	}

	routes(): void {
		this.router.post('/superadmin/authenticate', [guard.verifyToken, guard.isSuperAdmin], DjangoController.getAuthenticatedUser);
		this.router.post('/user/authenticate', guard.verifyToken, DjangoController.getAuthenticatedUserWithRole);
	}
}

const djangoRouter = new DjangoRouter();
djangoRouter.routes();

export default djangoRouter.router;
