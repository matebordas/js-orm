import { mapFieldsFromApi } from './mapFromApi.js';
import { mapFieldsForApi } from './mapForApi.js';

(function (global) {
    const JSORMLib ={
        mapFieldsFromApi,
        mapFieldsForApi,
    };

    if (typeof define === 'function' && define.amd) {
        define(function () { return JSORMLib; });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = JSORMLib;
    } else {
        global.JSORMLib = JSORMLib;
    }
})(this);
