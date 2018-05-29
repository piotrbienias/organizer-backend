'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

var sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres'
    }
);

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

export default models;