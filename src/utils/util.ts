/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object | null | undefined): boolean => {
  if (value === null || value === undefined) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};
