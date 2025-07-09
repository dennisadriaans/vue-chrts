export function rgbToHex(rgb) {
  // Extract the RGB values using a regular expression
  const values = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!values) {
    return rgb; // Return the original if it's not in standard rgb() format
  }
  // Convert each RGB component to its hexadecimal representation
  return (
    "#" +
    values
      .slice(1)
      .map((val) => {
        const hex = parseInt(val, 10).toString(16);
        return hex.padStart(2, "0");
      })
      .join("")
  );
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Generates an object of data series accessors based on a config.
 * @param {Object} config The configuration object.
 * @returns {Object} An object containing arrays of accessor functions.
 */
export const generateDataSeries = (config) => {
  const series = {};

  // Create a series for each state (e.g., series.done, series.pending)
  config.states.forEach((state) => {
    series[state] = config.platforms.map(
      (p) => (d) => d[`${p}${capitalize(state)}`]
    );
  });

  // Create the series for the total (e.g., series.total)
  series[config.totalKey.toLowerCase()] = config.platforms.map(
    (p) => (d) => d[`${p}${config.totalKey}`]
  );

  return series;
};


/**
 * A fully dynamic function to flatten and process data based on a config object.
 * @param {Array<Object>} data The raw data array.
 * @param {Object} config The configuration object.
 * @returns {Array<Object>} The transformed data array.
 */
export const dynamicFlattenData = (data, config) => {
  return data.map((entry) => {
    const flatEntry = { ...entry }; // Copy any existing top-level keys like 'month'

    // 1. Loop through each platform defined in the config (e.g., 'desktop')
    config.platforms.forEach(platform => {
      if (entry[platform]) {
        let sum = 0;
        
        // 2. Loop through each state for that platform (e.g., 'done', 'pending')
        config.states.forEach(state => {
          const value = entry[platform][state] || 0;
          
          // 3. Create the dynamic flattened key (e.g., 'desktop' + 'Done' -> 'desktopDone')
          const flattenedKey = `${platform}${capitalize(state)}`;
          flatEntry[flattenedKey] = value;
          
          sum += value;
        });

        // 4. Create the dynamic total key (e.g., 'desktop' + 'Total' -> 'desktopTotal')
        const totalKey = `${platform}${config.totalKey}`;
        flatEntry[totalKey] = sum;
      }
    });
    
    // Remove the original platform objects to keep the output clean
    config.platforms.forEach(platform => delete flatEntry[platform]);

    return flatEntry;
  });
};