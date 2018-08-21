'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

import connection from './../../conn';

var development = connection[process.env.NODE_ENV || 'development'];

var sequelize = new Sequelize(development);

sequelize.Validator.notNull = function(item) {
    return !this.isNull(item);
}

var db = {};

const modelsDirectory = path.dirname(__dirname) + '/models/';

const models = Object.assign({}, ...fs.readdirSync(modelsDirectory)
    .map(function(file){
        const model = require(path.join(modelsDirectory + file)).default;
        return {
            [model.name]: model.init(sequelize)
        };
    })
);


for(const model of Object.keys(models)) {
    typeof models[model].associate === 'function' && models[model].associate(models);
}

models.sequelize = sequelize;

export default models;