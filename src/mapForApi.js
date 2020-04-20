import { getObjectWithoutNestedKey } from './utils/getObjectWithoutNestedKeyUtil';
import { validateMappingObject } from './utils/validationUtil.js';
import { reservedKeys } from './contatnts.js';
import {findNestedValue} from "./utils/findNestedValueUtil";
import {clearObject} from "./utils/clearObjectUtil";

const mapValueToPathInObject = ({ parentObject, valuePath, newValue }) => {
    let currentParent = parentObject;
    const pathKeys = valuePath.split('.');
    pathKeys.forEach((key, index) => {
        const isLastKey = index === pathKeys.length - 1;
        if (isLastKey) { return; }
        if (!currentParent[key]) {
            currentParent[key] = { };
        }
        currentParent = currentParent[key];
    });

    const lastField = pathKeys[pathKeys.length - 1];
    currentParent[lastField] = newValue;
    return parentObject;
};

const transformValueForApi = ({
                                  value,
                                  transformForApi,
                              }) => {
    return transformForApi ? transformForApi(value) : value;
};

const mapFieldNamesForApi = (mappedData, mapping, rootEntityName) => {
    const hasRequiredRootEntity = rootEntityName ? !!mappedData[rootEntityName] : true;
    const result = { ...mappedData };

    const mappingEntries = Object.entries(mapping);
    const reverseFieldNamesMapping = (dataWithApiFieldNames, [mappingKey, mappingValue]) => {
        if (reservedKeys[mappingKey]) { return dataWithApiFieldNames; }

        if (typeof mappingValue === 'function') {
            return getObjectWithoutNestedKey(dataWithApiFieldNames, mappingKey);
        }

        const isFieldNameMapping = typeof mappingValue === 'string';
        if (!isFieldNameMapping) { return dataWithApiFieldNames; }

        const pathKeys = mappingValue.split('.');
        const lastFieldInPath = pathKeys[pathKeys.length - 1];
        if (lastFieldInPath === mappingKey) { return dataWithApiFieldNames; }

        const valueToMap = findNestedValue(mappedData, mappingKey);
        const newDataWithApiFieldNames = {
            ...dataWithApiFieldNames,
            ...mapValueToPathInObject({
                parentObject: dataWithApiFieldNames,
                newValue: valueToMap,
                valuePath: mappingValue,
            }),
        };

        return getObjectWithoutNestedKey(newDataWithApiFieldNames, mappingKey);
    };

    const mappedResult = mappingEntries.reduce(reverseFieldNamesMapping, result);
    const clearedObject = clearObject(mappedResult);
    return hasRequiredRootEntity ? clearedObject : { [rootEntityName]: clearedObject };
};

const mapFieldsForApi = (mappedData, mapping) => {
    if (!mappedData) { return {}; }
    if (!mapping) { return mappedData; }
    validateMappingObject(mapping);

    const rootEntityName = mapping.entityName || null;
    const resultWithFieldNamesMappings = mapFieldNamesForApi(mappedData, mapping, rootEntityName);

    return transformValueForApi({
        value: resultWithFieldNamesMappings,
        transformForApi: mapping.transformForApi,
    });
};

export {
    mapFieldsForApi,
};
