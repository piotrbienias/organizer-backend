import express from 'express';

import Storage from './../helpers/storage';
import { checkIfUserHasPermission } from './../helpers/auth';


export default (io) => {

    const storage = new Storage();

    var router = express.Router();

    // check if user can manage Storage
    router.use((req, res, next) => {
        checkIfUserHasPermission('can-manage-storage', req, res, next);
    });

    router.get('/objects', (req, res) => {
        storage.getObjects(req.query['directory']).then(result => {
            res.send(result);
        });
    });


    return router;

};