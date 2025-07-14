import express from "express";
import morgan from "morgan";
import userRoudes from './routes/user.routes.js'
import connect from "./db/db.js";

connect();

const app = express();
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRoudes)
// app.get('/', function(req,res){
//     res.send("server setUP is done")
// })

export default app
