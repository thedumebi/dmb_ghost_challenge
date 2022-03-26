/**
 * promise wrapper for function calls
 * @param {*} promise  async Function
 * @returns [result, error]
 */
const resolve = async (promise) => {
  try {
    const result = await promise;

    return [result, null];
  } catch (error) {
    return [null, error];
  }
};

module.exports = resolve;
