import jwt from 'jsonwebtoken';

 const authMiddleware = async (req, res, next) => {
    try {
        //get the token from header
        const token = req.header("authorization").split(" ")[1];
        const decryptToken = jwt.verify(token, process.env.jwt_secret);

        req.body.userId = decryptToken.userId;
        next();
        
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};
 
export default authMiddleware;