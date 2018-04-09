
// Classic Pipe function
export const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

// Expanded pipe for readability.
// export const pipe = function(...functions) {
//   return function(initialValue) {
//     return functions.reduce((accumulator, currentFunction) => {
//       return currentFunction(accumulator);
//     }, initialValue)
//   }
// }

// Loop through object keys and set default value if it don't exist
export const setObjectDefaults = (original, defaults) => {
  return Object.keys(defaults).reduce((current, field) => {
    const result = current;

    result[field] = result[field] || defaults[field];

    return result;
  }, original);
};

// Change object keys based on remap object
export const keyRenamer = (original, remapConfig) => {
  return Object.keys(remapConfig).reduce((current, oldKey) => {
    const result = current;

    // Check if key exists, then remap and delete old key
    if (oldKey in original) {
      const newKey = remapConfig[oldKey];
      result[newKey] = result[oldKey];
      delete result[oldKey];
    }

    return result;
  }, original);
};
