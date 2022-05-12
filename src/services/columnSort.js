/**
 * descendingComparator() compare two rows and return order
 * @param {object} a row object
 * @param {object} b another row object
 * @param {string} orderBy accessor to order by
 * @param {string} order either 'asc' or 'desc'
 * @return {int} order indicating relation between a and b based on given accessor
 */
function descendingComparator(a, b, orderBy, order) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  //if values are equal, always secondary sort by name
  if (b.name.localeCompare(a.name, undefined, { numeric: true }) === -1) {
    return order === "asc" ? -1 : 1;
  } else {
    return order === "asc" ? 1 : -1;
  }
  return 0;
}

/**
 * getComparator() order specified columns
 * @param {string} order ascending or descending order
 * @param {string} orderBy column accessor to order table by
 * @return {boolean} true or false for placement of rows based on value
 */
export function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy, order)
    : (a, b) => -descendingComparator(a, b, orderBy, order);
}
