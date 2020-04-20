const getObjectWithoutNestedKey = (parentObject, keyPath) => {
    let currentParent = parentObject;
    const pathKeys = keyPath.split('.');
    pathKeys.forEach((key, index) => {
        const isLastKey = index === pathKeys.length - 1;
        if (isLastKey) { return; }
        currentParent = currentParent[key];
    });

    const lastField = pathKeys[pathKeys.length - 1];
    delete currentParent[lastField]
    return parentObject;
}

export {
    getObjectWithoutNestedKey,
}