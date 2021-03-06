'use strict';

import Sequelize from 'sequelize';
import bcrypt from 'bcryptjs';


class User extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
            username: {
                type: Sequelize.STRING,
                unique: { msg: 'Podana nazwa uzytkownika jest juz zajęta' },
                allowNull: { msg: 'Proszę podać nazwę uzytkownika' }
            },
            password: {
                type: Sequelize.STRING,
                allowNull: { msg: 'Proszę podać hasło' },
                validate: {
                    notEmpty: { msg: 'Hasło nie moze być puste' }
                },
                set(value) {
                    this.setDataValue('password', bcrypt.hashSync(value, 10));
                }
            },
            userCategoryId: {
                type: Sequelize.INTEGER,
                references: {
                    model: sequelize.models.UserCategory,
                    key: 'id'
                }
            },
            email: {
                type: Sequelize.STRING,
                unique: { msg: 'Podany adres e-mail został juz uzyty' },
                allowNull: false,
                validate: {
                    notNull: { msg: 'Proszę podać adres e-mail' },
                    notEmpty: { msg: 'Proszę podać adres e-mail' },
                    isEmail: { msg: 'Proszę podać prawidłowy adres e-mail' }
                }
            }
        }, {
            sequelize: sequelize,
            tableName: 'users',
            timestamps: true,
            paranoid: true,
            scopes: {
                withUserCategory: function() {
                    return {
                        include: {
                            model: sequelize.models.UserCategory
                        }
                    };
                },
                withPermissions: function() {
                    return {
                        include: {
                            model: sequelize.models.Permission,
                            as: 'Permissions'
                        }
                    }
                }
            },
            setterMethods: {
                userCategory: function(userCategoryId) {
                    return this.setDataValue('userCategoryId', userCategoryId);
                }
            }
        });
    }

    static associate(models) {
        this.belongsTo(models.UserCategory, { foreignKey: 'userCategoryId' });
        this.belongsToMany(models.Permission, { as: 'Permissions', through: models.UserPermissions, foreignKey: 'userId' });
        this.belongsToMany(models.Event, { as: 'Events', through: models.EventMember, foreignKey: 'memberId' });
        this.belongsToMany(models.Reminder, { as: 'Reminders', through: models.ReminderUser, foreignKey: 'userId' });
    }

    static findByUsername(username) {
        return this.findOne({ where: { username: username } });
    }

    validatePassword(password) {
        return bcrypt.compareSync(password, this.get('password'));
    }

    changePassword(password) {
        this.set('password', password);
        return this.save();
    }

    serialize() {
        var user = {
            id: this.get('id'),
            username: this.get('username'),
            email: this.get('email'),
            isDeleted: !!this.get('deletedAt')
        };

        user.userCategory = this.UserCategory ? this.UserCategory.serialize() : this.get('userCategoryId');

        user.permissions = this.Permissions ? this.Permissions.map(permission => {
            return permission.serialize();
        }) : this.get('Permissions');

        return user;
    }

}


export default User;