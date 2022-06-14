import express from "express";
import morgan from "morgan";
import path from 'path';
import http from 'http';
import cors from 'cors';
import myRouter from './routes/index.js';

const port = process.env.PORT || 8080;
const __dirname = path.resolve();

const app = express();

app.use(
    cors({
        origin: true,
    })
)

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../build')))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
})
app.use(morgan('dev'));
app.use('/api', myRouter);

const server = http.createServer(app);
server.listen(port, '0.0.0.0');

server.on('error', (err) => {
    console.error(err)
})

server.on('listening', () => {
    console.log("server is running")
})

export default app;