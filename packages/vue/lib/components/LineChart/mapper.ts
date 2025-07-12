/**
 * Transforms an array of data objects into a new format for charting.
 * Each object will have:
 *   - x: the value of the property not in categories
 *   - value: array of values for keys in categories
 *
 * @param {Array<Object>} dataArray - The input array of objects.
 * @param {Array<string>} categories - The keys to extract as values.
 * @returns {Array<Object>} Array of objects with 'x' and 'value' properties.
 */
export function mapDataForChart(
  dataArray: Array<Record<string, any>>,
  categories: string[]
): Array<{ x: any; values: any[] }> {
  if (!Array.isArray(dataArray)) {
    console.error("Input dataArray must be an array.");
    return [];
  }
  if (!Array.isArray(categories)) {
    console.error("Input categories must be an array.");
    return [];
  }

  return dataArray.map((item, idx) => {
    // Find the key not in categories
    const nonCategoryKey = Object.keys(item).find(key => !categories.includes(key));
    const x = nonCategoryKey ? item[nonCategoryKey] : undefined;
    // Collect values for all category keys
    const values = categories.map(category => item[category]);
    return { x, idx, values };
  });
}
