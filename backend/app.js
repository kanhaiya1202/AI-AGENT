import express from "express";
import morgan from "morgan";
import userRoudes from './routes/user.routes.js'
import ProjectRoudes from './routes/project.routes.js'
import aiRoutes from './routes/ai.routes.js'
import connect from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from 'cors'
connect();

const app = express();
app.use(cors());
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use("/users", userRoudes)
app.use("/Project",ProjectRoudes)
app.use('/ai',aiRoutes)
// app.get('/', function(req,res){
//     res.send("server setUP is done")
// })

export default app
