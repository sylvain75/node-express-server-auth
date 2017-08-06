import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { router } from './router';
import cors from 'cors';
const app = express();
// DB setup
mongoose.connect('mongodb://localhost:auth/auth');

// App setup
app.use(morgan('combined')); // log for debugging
app.use(cors());
app.use(bodyParser.json({ type: '*/*' })); // for http request
router(app);

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("Server is listening on:", port);
