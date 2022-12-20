import { Router } from 'express';
import * as UserController from '../controllers/UserController';
import { guard } from '../middlewares/index';

class UserRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.routes();
	}

	routes(): void {
		this.router.get('/', [guard.verifyToken, guard.isLeaderOrAdminOrSuperAdmin], UserController.getUsers);
		this.router.get('/:id', guard.verifyToken, UserController.getUser);
		this.router.post('/', [guard.verifyToken, guard.isSuperAdmin, guard.userAlreadyExists], UserController.createUser);
		this.router.patch('/:id', guard.verifyToken, UserController.updateUser);
	}
}

const userRouter = new UserRouter();
userRouter.routes();

export default userRouter.router;
