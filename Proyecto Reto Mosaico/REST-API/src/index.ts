import express from 'express';
import morgan from 'morgan';
import DB from './config/mongodb';
import * as routers from './routers';
import { createRoles } from './config/initialSetup';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { createWebSocketService } from './services/WebSocketService';

const app = express();

//cors
const corsOption = {
    origin: ['http://localhost:9000', 'http://localhost:8000'],
    credentials: true,
    optionsSuccessStatus: 200,
};

//config
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('port', process.env.PORT || 3000);
app.use(cors(corsOption));
app.use(cookieParser());

//routes;
app.use('/account', routers.accountRouter);
app.use('/auth', routers.authRouter);
app.use('/config', routers.configRouter);
app.use('/django', routers.djangoRouter);
app.use('/token', routers.tokenRouter);
app.use('/role', routers.roleRouter);
app.use('/user', routers.userRouter);

//http server
const httpServer: http.Server = http.createServer(app);

//web-socket service
export const io: Server = createWebSocketService(httpServer, corsOption);

//start http server
httpServer.listen(app.get('port'), async () => {
    try {
        new DB();
        await createRoles();
        console.log('SERVIDOR ESCUCHANDO EN EL PUERTO: ', app.get('port'));
    } catch (error) {
        io.close();
        process.exit(0);
    }
});
