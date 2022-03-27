export const findNestedObject = (entireObject, key, val) => {
  let foundObj;

  JSON.stringify(entireObject, (_, nestedValue) => {
    if (nestedValue && nestedValue[key] === val) {
      foundObj = nestedValue;
    }
    return nestedValue;
  });
  return foundObj;
};
