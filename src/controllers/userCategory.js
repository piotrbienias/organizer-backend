import express from 'express';

import models from '../config/db';

var router = express.Router();


router.get('/', (req, res) => {

    models.UserCategory.findAll().then(userCategories => {
        res.send(userCategories.map(userCategory => {
            return userCategory.toJson();
        }));
    });

});


export default router;