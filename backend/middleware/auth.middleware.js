import jwt from 'jsonwebtoken';
import redisClient from '../services/redis.services.js';

export const authUser = async function (req, res, next) {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).send({
                error: "Unauthorizes User"
            })
        }

        const isBlackListe = await redisClient.get(token);

        if(isBlackListe){
            res.cookies('token','')
            res.status(401).send({error:"Unauthorizes User"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send({
            error: 'Unauthorizes User'
        })
    }
} 