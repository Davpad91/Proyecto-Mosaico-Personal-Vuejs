import { Router } from 'express';
import * as AuthController from '../controllers/AuthController';
import { guard } from '../middlewares/index';

class AuthRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.routes();
	}

	routes(): void {
		this.router.post('/signin', guard.isActive, AuthController.signIn);
		this.router.post('/signup', guard.userAlreadyExists, AuthController.signUp);
	}
}

const authRouter = new AuthRouter();
authRouter.routes();

export default authRouter.router;
