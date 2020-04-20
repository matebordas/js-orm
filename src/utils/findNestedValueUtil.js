const findNestedValue = (data, path) => {
    const sourceFields = path.split('.');
    const value = sourceFields.reduce((result, sourceField) => {
        const isUndefined = typeof result[sourceField] === 'undefined';
        const isNull = result[sourceField] === null;
        const isUndefinedOrNull = isUndefined || isNull;
        return !isUndefinedOrNull ? result[sourceField] : null;
    }, data);
    return value;
};

export {
    findNestedValue,
}