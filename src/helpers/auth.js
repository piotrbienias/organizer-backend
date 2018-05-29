import jwt from 'jsonwebtoken';


export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key', (error, decoded) => {
            if (error || !decoded) {
                return reject(error);
            }

            resolve(decoded);
        });
    });
};

export const createToken = (data) => {
    return jwt.sign({
        data: data
    }, process.env.JWT_SECRET || 'default-secret-key', { expiresIn: 60 * 5 });
};

export const verifyTokenMiddleware = (req, res, next) => {

    if (req.method !== 'OPTIONS'){
        
        let token = '';
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1];
        }

        verifyToken(token).then(decodedToken => {
            req.user = decodedToken.data;
            next();
        }).catch(e => {
            res.status(401).send({ message: 'Invalid authorization token' });
        });
    } else {
        next();
    }
    
};