import proj4 from 'proj4';
import inside from '@turf/boolean-point-in-polygon';
import type { MapRegion } from './types';

// Define the Google Mercator projection if not already defined
if (!proj4.defs('GOOGLE')) {
  proj4.defs('GOOGLE', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs');
}

export const DEFAULT_WORLD_REGION: MapRegion = {
  lat: { min: -56, max: 71 },
  lng: { min: -179, max: 179 },
};

export const geojsonToMultiPolygons = (geojson: any) => {
  const coordinates = geojson.features.reduce(
    (poly: any[], feature: any) =>
      poly.concat(
        feature.geometry.type === 'Polygon'
          ? [feature.geometry.coordinates]
          : feature.geometry.coordinates,
      ),
    [],
  );
  return { type: 'Feature', geometry: { type: 'MultiPolygon', coordinates } };
};

export const computeGeojsonBox = (geojson: any): MapRegion => {
  const { type, features, geometry, coordinates } = geojson;
  if (type === 'FeatureCollection') {
    const boxes = features.map(computeGeojsonBox);
    return {
      lat: {
        min: Math.min(...boxes.map((box: any) => box.lat.min)),
        max: Math.max(...boxes.map((box: any) => box.lat.max)),
      },
      lng: {
        min: Math.min(...boxes.map((box: any) => box.lng.min)),
        max: Math.max(...boxes.map((box: any) => box.lng.max)),
      },
    };
  } else if (type === 'Feature') {
    return computeGeojsonBox(geometry);
  } else if (type === 'MultiPolygon') {
    return computeGeojsonBox({
      type: 'Polygon',
      coordinates: coordinates.flat(1),
    });
  } else if (type === 'Polygon') {
    const coords = coordinates.flat(1);
    const latitudes = coords.map(([_lng, lat]: [number, number]) => lat);
    const longitudes = coords.map(([lng, _lat]: [number, number]) => lng);

    return {
      lat: {
        min: Math.min(...latitudes),
        max: Math.max(...latitudes),
      },
      lng: {
        min: Math.min(...longitudes),
        max: Math.max(...longitudes),
      },
    };
  } else {
    throw new Error(`Unknown geojson type ${type}`);
  }
};

export interface MapData {
  points: Record<string, { x: number; y: number; lat: number; lng: number; countryId?: string; data?: any; svgOptions?: any }>;
  X_MIN: number;
  Y_MIN: number;
  X_MAX: number;
  Y_MAX: number;
  X_RANGE: number;
  Y_RANGE: number;
  region: MapRegion;
  grid: 'vertical' | 'diagonal';
  height: number;
  width: number;
  ystep: number;
}

export const getMap = ({
  height = 0,
  width = 0,
  countries = [],
  region,
  grid = 'vertical',
  geojsonWorld,
}: {
  height?: number;
  width?: number;
  countries?: string[];
  region?: MapRegion;
  grid?: 'vertical' | 'diagonal';
  geojsonWorld: any;
}): MapData => {
  if (height <= 0 && width <= 0) {
    throw new Error('height or width is required');
  }

  const geojsonByCountry = geojsonWorld.features.reduce((acc: any, feature: any) => {
    acc[feature.id] = feature;
    return acc;
  }, {});

  let geojson = geojsonWorld;
  if (countries.length > 0) {
    geojson = {
      type: 'FeatureCollection',
      features: countries.map((country) => geojsonByCountry[country]).filter(Boolean),
    };
    if (!region) {
      region = computeGeojsonBox(geojson);
    }
  } else if (!region) {
    region = DEFAULT_WORLD_REGION;
  }

  const poly = geojsonToMultiPolygons(geojson);

  const [X_MIN, Y_MIN] = (proj4 as any)('GOOGLE', [
    region!.lng.min,
    region!.lat.min,
  ]);
  const [X_MAX, Y_MAX] = (proj4 as any)('GOOGLE', [
    region!.lng.max,
    region!.lat.max,
  ]);
  const X_RANGE = X_MAX - X_MIN;
  const Y_RANGE = Y_MAX - Y_MIN;

  if (width <= 0) {
    width = Math.round((height * X_RANGE) / Y_RANGE);
  } else if (height <= 0) {
    height = Math.round((width * Y_RANGE) / X_RANGE);
  }

  const points: MapData['points'] = {};
  const ystep = grid === 'diagonal' ? Math.sqrt(3) / 2 : 1;

  for (let y = 0; y * ystep < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const localx = y % 2 === 0 && grid === 'diagonal' ? x + 0.5 : x;
      const localy = y * ystep;

      const pointGoogle = [
        (localx / width) * X_RANGE + X_MIN,
        Y_MAX - (localy / height) * Y_RANGE,
      ];
      const wgs84Point = (proj4 as any)(
        'GOOGLE',
        'WGS84',
        pointGoogle,
      );

      const countryFeature = geojson.features.find((f: any) => inside(wgs84Point as any, f));
      if (countryFeature) {
        const [lng, lat] = wgs84Point;
        points[[x, y].join(";")] = { x: localx, y: localy, lat, lng, countryId: countryFeature.id };
      }
    }
  }

  return {
    points,
    X_MIN,
    Y_MIN,
    X_MAX,
    Y_MAX,
    X_RANGE,
    Y_RANGE,
    region: region!,
    grid,
    height,
    width,
    ystep,
  };
};

export const getPin = (map: MapData, { lat, lng }: { lat: number; lng: number }) => {
  const [googleX, googleY] = (proj4 as any)('GOOGLE', [lng, lat]);
  
  let [rawX, rawY] = [
    (map.width * (googleX - map.X_MIN)) / map.X_RANGE,
    (map.height * (map.Y_MAX - googleY)) / map.Y_RANGE,
  ];
  
  const y = Math.round(rawY / map.ystep);
  if (y % 2 === 0 && map.grid === 'diagonal') {
    rawX -= 0.5;
  }
  const x = Math.round(rawX);
  let [localx, localy] = [x, Math.round(y) * map.ystep];
  if (y % 2 === 0 && map.grid === 'diagonal') {
    localx += 0.5;
  }

  const [localLng, localLat] = (proj4 as any)(
    'GOOGLE',
    'WGS84',
    [
      (localx * map.X_RANGE) / map.width + map.X_MIN,
      map.Y_MAX - (localy * map.Y_RANGE) / map.height,
    ],
  );

  return { x: localx, y: localy, lat: localLat, lng: localLng };
};
