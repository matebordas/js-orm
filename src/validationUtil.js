const flattenObject = (obj) => {
    const flattened = {}

    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            Object.assign(flattened, flattenObject(obj[key]))
        } else {
            flattened[key] = obj[key]
        }
    })

    return flattened
}

const validateMappingObject = (mapping) => {
    if (!mapping) { return; }
    if (typeof mapping !== 'object') {
        throw Error('Mapping must be of type object');
    }
    if (!Object.keys(mapping).length) { return; }

    const {
        transformFromApi,
        transformForApi,
    } = mapping;

    const hasValidTransformFromApi = !!transformFromApi && typeof transformFromApi === 'function';
    const hasValidTransformForApi = !!transformForApi && typeof transformForApi === 'function';
    if (hasValidTransformFromApi && !hasValidTransformForApi) {
        throw Error('transformForApi function must be provided when using transformFromApi');
    }

    const flattenedMapping = flattenObject(mapping);
    Object.values(flattenedMapping).forEach((mappingValue) => {
        const typeOfMappingValue = typeof mappingValue;
        if (typeOfMappingValue !== 'string' && typeOfMappingValue !== 'function') {
            throw Error('Field mappings must be of type string or function');
        }

        if (typeOfMappingValue === 'function' && !hasValidTransformForApi) {
            throw Error('transformForApi function must be provided when using function values');
        }
    });
};

export {
    validateMappingObject,
};
