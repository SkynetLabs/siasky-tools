import { thresholds } from "../constants/consts";

/**
 * getStyle() get color of table cell based on set thresholds
 * @param {number} val value of the current cell
 * @param {string} accessor accessor of the current cell
 * @return {string} color of current cell
 */
export const getStyle = (val, accessor) => {
  let color = "black";
  if (accessor in thresholds) {
    const styleArr = thresholds[accessor];
    styleArr.forEach((item) => {
      switch (item.comparator) {
        case "gt":
          if (val > item.value) {
            color = item.color;
          }
          break;
        case "lt":
          if (val < item.value) {
            color = item.color;
          }
          break;
        case "eq":
          if (val === item.value) {
            color = item.color;
          }
          break;
        case "includes":
          if (val.includes(item.value)) {
            color = item.color;
          }
          break;
        default:
          color = "black";
          break;
      }
    });
    return color;
  }
  return "";
};
