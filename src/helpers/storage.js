'use strict';

import GCS from './../config/storage';


class Storage {

    constructor() {
        this.bucket = GCS.bucket;
        this.storage = GCS.storage;
    }

    getObjects(directory = '') {
        // append trailing slash to the directory name
        if ( ! directory.endsWith('/') && directory !== '' ) {
            directory += '/';
        }

        let options = {
            directory: directory
        };

        return this.bucket.getFiles(options).then(results => {
            let files = results[0];

            let directoryFiles = [];
            let directoryFolders = [];

            files.forEach(file => {
                let filenameWithoutDirectory = file.name.substring(file.name.indexOf(directory) + directory.length, file.name.length);

                if ( filenameWithoutDirectory === '' ) {
                    return;
                }

                let fileNameArray = filenameWithoutDirectory.split('/');

                if ( fileNameArray.length === 1 ) {
                    directoryFiles.push(file);
                } else if ( fileNameArray.length === 2 && file.name.endsWith('/') ){
                    directoryFolders.push(file);
                }
            });

            return {
                files: directoryFiles,
                folders: directoryFolders
            };
        });
    }

}


export default Storage;