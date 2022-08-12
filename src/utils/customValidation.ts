import Joi from 'joi';

/**
 * allow orderBy validation
 *
 * @param keys string[]
 * @returns
 */
export const allowedOrderBy =
  (keys: string[]) => (value: string, helpers: Joi.CustomHelpers<any>) => {
    const [field, direction] = value.split('=');

    if (direction && !['asc', 'desc'].includes(direction))
      return helpers.error('any.invalid');

    if (!keys.includes(field)) return helpers.error('any.invalid');

    return value;
  };

/**
 * allowed include relationship keys
 *
 * @param keys string[]
 * @returns
 */
export const allowedInclude =
  (keys: string[]) => (value: string, helpers: Joi.CustomHelpers<any>) => {
    const isValid = value
      .split(',')
      .every((item) => keys.includes(item.trim()));

    if (!isValid) return helpers.error('any.invalid');

    return value;
  };

/**
 * allowed filter
 *
 * @param key string[]
 */
export function allowedFilter(key: string[]) {
  //
}
