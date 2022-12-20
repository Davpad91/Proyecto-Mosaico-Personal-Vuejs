import mongoose from 'mongoose';

class ConnectionMongo {
	private static _connectDb: ConnectionMongo;
	constructor() {
		this.connectionmDB();
	}
	connectionmDB() {
		mongoose
			.connect('mongodb+srv://mosaico_user:mosaico_password@users.ekzlcqg.mongodb.net/auth')
			.then(() => console.log('CONEXIÓN CON LA BASE DE DATOS ESTABLECIDA CORRECTAMENTE'))
			.catch(() => console.log('HA FALLADO LA CONEXIÓN CON LA BASE DE DATOS'));
	}
	static getConnectdb() {
		if (!this._connectDb) {
			return this._connectDb;
		}
		this._connectDb = new ConnectionMongo();
		return this._connectDb;
	}
}
export default ConnectionMongo;
