import jwt from 'jsonwebtoken';
import models from './../config/db';
import { find } from 'underscore';


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
    }, process.env.JWT_SECRET || 'default-secret-key', { expiresIn: 60 * 60 });
};

export const verifyTokenMiddleware = (req, res, next) => {

    console.log(req.method);

    if (req.method !== 'OPTIONS'){
        
        let token = '';
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1];
        }

        verifyToken(token).then(decodedToken => {
            models.User.scope(['withUserCategory', 'withPermissions']).findById(decodedToken.data.id).then(user => {
                req.user = user.serialize();
                next();
            });
        }).catch(e => {
            res.status(401).send({ message: 'Invalid authorization token' });
        });
    } else {
        next();
    }
    
};

export const checkIfUserHasPermission = (permissionLabel, req, res, next) => {

    if ( process.env.OMIT_AUTH ) {
        next();
    } else {
        if (req.method !== 'OPTIONS') {

        
            if (!req.user) {
                return res.status(401).send({ message: 'Brak autoryzacji', statusCode: 401 });
            }
    
            var userHasPermission = find(req.user.permissions, (permission) => {
                return permission.label === permissionLabel
            });
    
            if (userHasPermission) {
                next();
            } else {
                res.status(401).send({ message: 'Brak autoryzacji', statusCode: 401 });
            }
        } else {
            next();
        }
    }
    
};