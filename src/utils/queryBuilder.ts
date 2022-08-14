/**
 * has relationship in given input
 *
 * @param include string
 * @param key string
 * @returns boolean
 */
export function registerInclude(include: string, key: string) {
  if (!include) return false;

  return include
    .split(',')
    .map((item) => item.trim())
    .includes(key);
}

/**
 * select field from given input
 *
 * @param select string
 * @returns
 */
export function registerSelect(select: string) {
  if (!select) return undefined;

  return select
    .split(',')
    .map((item) => item.trim())
    .reduce((a, b) => ({ ...a, [b]: true }), {});
}

/**
 * order by field
 *
 * @param orderBy string
 */
export function registerOrderBy(orderBy: string) {
  if (!orderBy) return undefined;

  const [field, direction] = orderBy.split('=');

  return { [field]: direction ? direction : 'asc' };
}
