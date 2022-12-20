import { Router } from 'express';
import * as TokenController from '../controllers/TokenController';

class TokenRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.routes();
	}

	routes(): void {
		this.router.post('/refresh', TokenController.refreshAccessToken);
		this.router.post('/verify/access', TokenController.validateAccessToken);
		this.router.post('/verify/refresh', TokenController.validateRefreshToken);
	}
}

const tokenRouter = new TokenRouter();
tokenRouter.routes();

export default tokenRouter.router;
