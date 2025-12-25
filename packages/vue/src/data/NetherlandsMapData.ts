import netherlandsTopoJSON from './netherlands.topo.json'

export const NetherlandsTopoJSON = netherlandsTopoJSON

export type NetherlandsProvince = {
  GID_1: string
  GID_0: string
  COUNTRY: string
  NAME_1: string
  VARNAME_1: string
  NL_NAME_1: string
  TYPE_1: string
  ENGTYPE_1: string
  CC_1: string
  HASC_1: string
  ISO_1: string
}

// Netherlands provinces with some example data
export const netherlandsProvincesData = [
  { id: 'NL-DR', name: 'Drenthe', color: '#3b82f6', population: 493682 },
  { id: 'NL-FL', name: 'Flevoland', color: '#10b981', population: 423021 },
  { id: 'NL-FR', name: 'Friesland', color: '#f59e0b', population: 649944 },
  { id: 'NL-GE', name: 'Gelderland', color: '#ef4444', population: 2084478 },
  { id: 'NL-GR', name: 'Groningen', color: '#8b5cf6', population: 584463 },
  { id: 'NL-LI', name: 'Limburg', color: '#ec4899', population: 1116834 },
  { id: 'NL-NB', name: 'Noord-Brabant', color: '#14b8a6', population: 2562566 },
  { id: 'NL-NH', name: 'Noord-Holland', color: '#f97316', population: 2877909 },
  { id: 'NL-OV', name: 'Overijssel', color: '#6366f1', population: 1162215 },
  { id: 'NL-UT', name: 'Utrecht', color: '#84cc16', population: 1353596 },
  { id: 'NL-ZE', name: 'Zeeland', color: '#06b6d4', population: 383488 },
  { id: 'NL-ZH', name: 'Zuid-Holland', color: '#a855f7', population: 3708696 },
]

// Major Dutch cities with coordinates
export const netherlandsCities = [
  { id: 'amsterdam', name: 'Amsterdam', latitude: 52.3676, longitude: 4.9041, population: 872680 },
  { id: 'rotterdam', name: 'Rotterdam', latitude: 51.9225, longitude: 4.47917, population: 651446 },
  { id: 'the-hague', name: 'The Hague', latitude: 52.0705, longitude: 4.3007, population: 545163 },
  { id: 'utrecht', name: 'Utrecht', latitude: 52.0907, longitude: 5.1214, population: 357694 },
  { id: 'eindhoven', name: 'Eindhoven', latitude: 51.4416, longitude: 5.4697, population: 234456 },
  { id: 'groningen', name: 'Groningen', latitude: 53.2194, longitude: 6.5665, population: 233218 },
  { id: 'tilburg', name: 'Tilburg', latitude: 51.5555, longitude: 5.0913, population: 219800 },
  { id: 'almere', name: 'Almere', latitude: 52.3508, longitude: 5.2647, population: 211840 },
]
