import jwt from 'jsonwebtoken';

export const authUser = async function (req, res, next) {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).send({
                error: "Unauthorizes User"
            })
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