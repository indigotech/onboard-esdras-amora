import { Server } from './server';
import dotenv from 'dotenv';

dotenv.config();
const server = new Server();

server.listen((port) => {
	console.log(`Server running at port: ${port}`);
});
