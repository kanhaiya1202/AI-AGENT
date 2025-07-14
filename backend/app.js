import express from "express";
import morgan from "morgan";

const app = express();
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', function(req,res){
    res.send("server setUP is done")
})
export default app
