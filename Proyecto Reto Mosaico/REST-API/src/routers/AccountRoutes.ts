import { Router } from 'express';
import * as AccountController from '../controllers/AccountController';
import { guard } from '../middlewares/index';

class AccountRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.routes();
	}

	routes(): void {
		this.router.get('', guard.verifyToken, AccountController.getAccount);
		this.router.patch('/update', guard.verifyToken, AccountController.updateAccount);
		this.router.patch('/changepassword', guard.verifyToken, AccountController.changePassword);
		this.router.patch('/setpassword', guard.verifyToken, AccountController.setPassword);
	}
}

const accountRouter = new AccountRouter();
accountRouter.routes();

export default accountRouter.router;
