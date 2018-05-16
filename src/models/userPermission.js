'use strict';

import Sequelize from 'sequelize';


export default class UserPermissions extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
            
        }, {
            sequelize: sequelize,
            tableName: 'user_permissions',
            paranoid: false,
            timestamps: false
        });
    }

}