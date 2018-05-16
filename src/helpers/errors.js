'use strict';


var TransformSequelizeValidationError = (SequelizeValidationError) => {
    return SequelizeValidationError.errors.map(error => {
        return {
            message: error.message,
            field: error.path
        };
    });
}


export {
    TransformSequelizeValidationError
};