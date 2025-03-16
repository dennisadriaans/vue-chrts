export interface ElectionDatum {
  year: number
  democrat: number
  republican: number
  other: number
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const BarChartData: ElectionDatum[] = [
  {
    year: 1980,
    republican: 43642639,
    democrat: 35480948,
    other: 6505863,
  },
  {
    year: 1984,
    republican: 54166829,
    democrat: 37449813,
    other: 811015,
  },
  {
    year: 1988,
    republican: 48642640,
    democrat: 41716679,
    other: 817798,
  },
  {
    year: 1992,
    republican: 38798913,
    democrat: 44856747,
    other: 20663272,
  },
  {
    year: 1996,
    republican: 39003697,
    democrat: 47295351,
    other: 9625419,
  },
  {
    year: 2000,
    republican: 50311372,
    democrat: 50830580,
    other: 4071625,
  },
  {
    year: 2004,
    republican: 61872711,
    democrat: 58894561,
    other: 1212870,
  },
  {
    year: 2008,
    republican: 59613835,
    democrat: 69338846,
    other: 1956116,
  },
  {
    year: 2012,
    republican: 60670117,
    democrat: 65752017,
    other: 1501463,
  },
  {
    year: 2016,
    republican: 62692670,
    democrat: 65677288,
    other: 4292059,
  },
  {
    year: 2020,
    democrat: 81268908,
    republican: 74216146,
    other: 1246094,
  },
]
