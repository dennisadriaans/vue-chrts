import { geoPath, geoAzimuthalEqualArea } from 'd3-geo';

export interface GridPoint {
  x: number;
  y: number;
  lat: number;
  lng: number;
}

/**
 * Convert a GeoJSON to a grid of points for visualization
 * @param geoJson - The GeoJSON FeatureCollection
 * @param gridSize - Number of rows in the grid (width will be calculated to maintain aspect ratio)
 * @param gridType - Type of grid: 'square' or 'hex'
 * @returns Array of points with x, y, lat, lng coordinates
 */
export function geoJsonToGrid(
  geoJson: any,
  gridSize: number = 80,
  gridType: 'square' | 'hex' = 'square'
): GridPoint[] {
  // Create a projection centered on Europe
  const projection = geoAzimuthalEqualArea()
    .rotate([-20, -52]) // Center on Europe
    .scale(800)
    .translate([400, 400]);

  const path = geoPath().projection(projection);

  // Calculate bounding box
  const bounds = path.bounds(geoJson);
  const [[x0, y0], [x1, y1]] = bounds;
  const width = x1 - x0;
  const height = y1 - y0;

  // Calculate grid spacing
  const spacing = height / gridSize;
  const cols = Math.ceil(width / spacing);

  const points: GridPoint[] = [];

  // Generate grid points
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < cols; col++) {
      let x: number, y: number;

      if (gridType === 'hex') {
        // Hexagonal grid (offset every other row)
        const xOffset = row % 2 === 0 ? 0 : spacing / 2;
        x = x0 + col * spacing + xOffset;
        y = y0 + row * spacing * 0.866; // 0.866 ≈ sqrt(3)/2 for hex packing
      } else {
        // Square grid
        x = x0 + col * spacing;
        y = y0 + row * spacing;
      }

      // Check if point is within any feature
      const point = [x, y];
      let isInside = false;

      // Check against all features in the GeoJSON
      for (const feature of geoJson.features) {
        if (path.contains(point, feature)) {
          isInside = true;
          break;
        }
      }

      if (isInside) {
        // Get lat/lng from projected coordinates
        const coords = projection.invert!([x, y]);
        if (coords) {
          points.push({
            x,
            y,
            lng: coords[0],
            lat: coords[1],
          });
        }
      }
    }
  }

  return points;
}
