'use strict';

import { mapObject } from 'underscore';


var TransformSequelizeValidationError = (SequelizeValidationError) => {
    return SequelizeValidationError.errors.map(error => {
        return { [error.path]: error.message };
    });
}

let ERROR_CLASSES = [
    'UniqueConstraintError',
    'ForeignKeyConstraintError',
    'ExclusionConstraintError'
];

let SIMPLE_ERROR_CLASSES = [
    'SequelizeScopeError',
    'DatabaseError',
    'UnknownConstraintError',
    'TimeoutError',
    'ConnectionError',
    'ConnectionRefusedError',
    'AccessDeniedError',
    'HostNotFoundError',
    'HostNotReachableError',
    'InvalidConnectionError',
    'ConnectionTimedOutError',
    'InstanceError',
    'EmptyResultError',
    'EagerLoadingError',
    'AssociationError',
    'QueryError',
    'BulkRecordError'
];

var apiError = (error) => {

    var errorObject = {
        statusCode: 422,
        message: 'Błąd podczas wykonywania operacji',
        data: {
            type: error.constructor.name,
            message: error.message
        }
    };

    if (SIMPLE_ERROR_CLASSES.includes(error.constructor.name)) {

        errorObject.statusCode = 500;

    } else if (error.constructor.name === 'UniqueConstraintError') {

        errorObject.data['fields'] = mapObject(error.fields, (field, value) => { return error.message });

    } else if (error.constructor.name === 'ExclusionConstraintError') {

        errorObject.data['fields'] = error.fields;
        errorObject.data['value'] = error.value;

    } else if (error.constructor.name === 'ValidationError') {

        errorObject.data.fields = {};
        Object.assign(errorObject.data.fields, ...error.errors.map(singleError => {
            return { [singleError.path]: singleError.message };
        }));
    } else if (error.constructor.name === 'ForeignKeyConstraintError') {

        errorObject.data.fields = {
            [error.index.split('_')[1].slice(0, -2)]: 'Wybrany element nie istnieje'
        };

    }

    return errorObject;
}


export {
    TransformSequelizeValidationError,
    apiError
};