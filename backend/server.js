import dotenv from 'dotenv/config.js';
import app from './app.js';
import http from 'http'


const server = http.createServer(app);
const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`server start${port}`)
})