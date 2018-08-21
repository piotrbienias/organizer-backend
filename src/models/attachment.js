'use strict';

import Sequelize from 'sequelize';


class Attachment extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            path: {
                type: Sequelize.STRING,
                allowNull: false
            },
            filename: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: Sequelize.TEXT
        }, {
            sequelize: sequelize,
            tableName: 'attachments',
            paranoid: true,
            timestamps: true
        });
    }

}


export default Attachment;