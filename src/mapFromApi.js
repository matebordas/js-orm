import { reservedKeys } from './contatnts.js';
import { validateMappingObject } from './utils/validationUtil.js';
import {mergeDeep} from "./utils/deepMergeUtil";
import {findNestedValue} from "./utils/findNestedValueUtil";

const mapResponsePathToObject = ({ objectToMap, keyName, valuePath }) => {
    const valueToMap = findNestedValue(objectToMap, valuePath);
    const pathKeys = keyName.split('.');

    const mappedObject = {};
    let currentParent = mappedObject;
    pathKeys.forEach((key, index) => {
        const isLastKey = index === pathKeys.length - 1;
        if (isLastKey) { return; }
        currentParent[key] = { };
        currentParent = currentParent[key];
    });

    const lastField = pathKeys[pathKeys.length - 1];
    currentParent[lastField] = valueToMap;
    return mappedObject;
};

const transformValueFromApi = ({
   value,
   transformFromApi,
   response,
}) => {
    return transformFromApi ? transformFromApi(value, response) : value;
};

const resolveMappingValue = ({
    mappingConfiguration,
    mappingKey,
    mappedResult,
    response,
}) => {
    switch (typeof mappingConfiguration) {
        case 'function': {
            const newValue = mappingConfiguration(mappedResult, response);
            return {
                ...mappedResult,
                [mappingKey]: newValue,
            };
        }
        default: {
            const mappedObject = mapResponsePathToObject({
                objectToMap: response,
                keyName: mappingKey,
                valuePath: mappingConfiguration,
            });
            return mergeDeep(mappedResult, mappedObject);
        }
    }
};

const mapResponseFields = (response, mapping) => {
    const mapFields = (mappedResult, mappingKey) => {
        const mappingConfiguration = mapping[mappingKey];
        if (!mappingConfiguration) {
            return { ...mappedResult };
        }
        if (reservedKeys[mappingKey]) {
            return { ...mappedResult };
        }

        const newMappedObject = resolveMappingValue({
            mappingConfiguration,
            mappingKey,
            mappedResult,
            response,
        });
        return  {
            ...mappedResult,
            ...newMappedObject,
        }
    };

    const mappingKeys = Object.keys(mapping);
    if (!mappingKeys.length) { return response; }
    return mappingKeys.reduce(mapFields, {});
};

const mapFieldsFromApi = (response, mapping) => {
    if (!response) { return {}; }
    if (!mapping) { return response; }
    validateMappingObject(mapping);

    const mappingKeys = Object.keys(mapping);
    if (!mappingKeys.length) { return response; }

    const mappedResult = mapResponseFields(response, mapping);
    const result = transformValueFromApi({
        value: mappedResult,
        transformFromApi: mapping.transformFromApi,
        response,
    });

    return result;
};

export {
    mapFieldsFromApi,
};
