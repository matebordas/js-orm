const clearObject = (obj) => {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] !== 'object') { return; }
        if (!Object.keys(obj[key]).length) {
            delete obj[key];
            return;
        }
        clearObject(obj[key])
    });
    return obj;
};

export {
    clearObject,
}