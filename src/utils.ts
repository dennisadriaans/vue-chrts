export function rgbToHex(rgb) {
    // Extract the RGB values using a regular expression
    const values = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!values) {
      return rgb; // Return the original if it's not in standard rgb() format
    }
    // Convert each RGB component to its hexadecimal representation
    return '#' + values.slice(1).map(val => {
      const hex = parseInt(val, 10).toString(16);
      return hex.padStart(2, '0');
    }).join('');
  }