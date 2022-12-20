import { Role } from '../models/RoleSchema';

export const createRoles = async () => {
	try {
		const count = await Role.estimatedDocumentCount();
		if (count > 0) return;

		return await Promise.all([
			new Role({
				name: 'SuperAdministrador',
				description: 'Modificación de la interfaz principal y acceso a la base de datos del sistema',
				hierarchy: 4,
			}).save(),
			new Role({
				name: 'Administrador',
				description: 'Modificación de la interfaz gráfica y los módulos del dashboard',
				hierarchy: 3,
			}).save(),
			new Role({
				name: 'Lider',
				description: 'Acceso a la lista de analístas',
				hierarchy: 2,
			}).save(),
			new Role({
				name: 'Analista',
				description: 'Acceso a los módulos del dashboard principal',
				hierarchy: 1,
			}).save(),
		]);
	} catch (error) {
		console.log(error);
	}
};


