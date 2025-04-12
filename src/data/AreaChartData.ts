import type { BulletLegendItemInterface } from '@unovis/ts'

/* Demo data for homepage */
export const categories1: Record<string, BulletLegendItemInterface> = {
  desktop: { name: 'Desktop', color: '#156F36' },
  mobile: { name: 'Mobile', color: '#4ade80' }
}

export const categories2: Record<string, BulletLegendItemInterface> = {
  temperature: { name: 'Temperature', color: '#00dc82' }
}

export const categories3: Record<string, BulletLegendItemInterface> = {
  desktop: { name: 'Desktop', color: '#156F36' },
  mobile: { name: 'Mobile', color: '#4ade80' }
}

export const categories4: Record<string, BulletLegendItemInterface> = {
  firstTime: { name: 'First time', color: '#156F36' },
  returning: { name: 'Returning', color: '#156F3640' }
}

export const categories5: Record<string, BulletLegendItemInterface> = {
  desktop: { name: 'Desktop', color: '#4ade80' }
}

export interface AreaChartItem1 {
  date: string
  desktop: number
  mobile: number
}

export const AreaChartData1: AreaChartItem1[] = [
  { date: '2024-04-01', desktop: 222, mobile: 150 },
  { date: '2024-04-02', desktop: 180, mobile: 97 },
  { date: '2024-04-03', desktop: 167, mobile: 120 },
  { date: '2024-04-04', desktop: 260, mobile: 240 },
  { date: '2024-04-05', desktop: 373, mobile: 290 },
  { date: '2024-04-06', desktop: 340, mobile: 310 },
  { date: '2024-04-07', desktop: 245, mobile: 180 },
  { date: '2024-04-08', desktop: 409, mobile: 320 },
  { date: '2024-04-09', desktop: 110, mobile: 59 },
  { date: '2024-04-10', desktop: 261, mobile: 190 },
  { date: '2024-04-11', desktop: 350, mobile: 327 },
  // { date: '2024-04-12', desktop: 292, mobile: 210 },
  // { date: '2024-04-13', desktop: 380, mobile: 342 },
  // { date: '2024-04-14', desktop: 220, mobile: 137 },
  // { date: '2024-04-15', desktop: 170, mobile: 120 },
  // { date: '2024-04-16', desktop: 190, mobile: 138 },
  // { date: '2024-04-17', desktop: 446, mobile: 360 },
  // { date: '2024-04-18', desktop: 410, mobile: 364 },
  // { date: '2024-04-19', desktop: 243, mobile: 180 },
  // { date: '2024-04-20', desktop: 150, mobile: 89 },
  // { date: '2024-04-21', desktop: 200, mobile: 137 },
  // { date: '2024-04-22', desktop: 224, mobile: 170 },
  // { date: '2024-04-23', desktop: 230, mobile: 138 },
  // { date: '2024-04-24', desktop: 387, mobile: 290 },
  // { date: '2024-04-25', desktop: 250, mobile: 215 },
  // { date: '2024-04-26', desktop: 130, mobile: 75 },
  // { date: '2024-04-27', desktop: 420, mobile: 383 },
  // { date: '2024-04-28', desktop: 180, mobile: 122 },
  // { date: '2024-04-29', desktop: 315, mobile: 240 },
  // { date: '2024-04-30', desktop: 454, mobile: 380 },
  // { date: '2024-05-01', desktop: 220, mobile: 165 },
  // { date: '2024-05-02', desktop: 310, mobile: 293 },
  // { date: '2024-05-03', desktop: 247, mobile: 190 },
  // { date: '2024-05-04', desktop: 420, mobile: 385 },
  // { date: '2024-05-05', desktop: 481, mobile: 390 },
  // { date: '2024-05-06', desktop: 520, mobile: 489 },
  // { date: '2024-05-07', desktop: 388, mobile: 300 },
  // { date: '2024-05-08', desktop: 210, mobile: 149 },
  // { date: '2024-05-09', desktop: 227, mobile: 180 },
  // { date: '2024-05-10', desktop: 330, mobile: 293 },
  // { date: '2024-05-11', desktop: 335, mobile: 270 },
  // { date: '2024-05-12', desktop: 240, mobile: 197 },
  // { date: '2024-05-13', desktop: 197, mobile: 160 },
  // { date: '2024-05-14', desktop: 490, mobile: 448 },
  // { date: '2024-05-15', desktop: 473, mobile: 473 },
  // { date: '2024-06-01', desktop: 222, mobile: 150 },
  // { date: '2024-06-02', desktop: 180, mobile: 97 },
  // { date: '2024-06-03', desktop: 167, mobile: 120 },
  // { date: '2024-06-04', desktop: 260, mobile: 240 },
  // { date: '2024-06-05', desktop: 373, mobile: 290 },
  // { date: '2024-06-06', desktop: 340, mobile: 310 },
  // { date: '2024-06-07', desktop: 245, mobile: 180 },
  // { date: '2024-06-08', desktop: 409, mobile: 320 },
  // { date: '2024-06-09', desktop: 110, mobile: 59 },
  // { date: '2024-06-10', desktop: 261, mobile: 190 },
  // { date: '2024-06-11', desktop: 350, mobile: 327 },
  // { date: '2024-06-12', desktop: 292, mobile: 210 },
  // { date: '2024-06-13', desktop: 380, mobile: 342 },
  // { date: '2024-06-14', desktop: 220, mobile: 137 },
  // { date: '2024-06-15', desktop: 170, mobile: 120 },
  // { date: '2024-06-16', desktop: 190, mobile: 138 },
  // { date: '2024-06-17', desktop: 446, mobile: 360 },
  // { date: '2024-06-18', desktop: 410, mobile: 364 },
  // { date: '2024-06-19', desktop: 243, mobile: 180 },
  // { date: '2024-06-20', desktop: 150, mobile: 89 },
  // { date: '2024-06-21', desktop: 200, mobile: 137 },
  // { date: '2024-06-22', desktop: 224, mobile: 170 },
  // { date: '2024-06-23', desktop: 230, mobile: 138 },
  // { date: '2024-06-24', desktop: 387, mobile: 290 },
  // { date: '2024-06-25', desktop: 250, mobile: 215 },
  // { date: '2024-06-26', desktop: 130, mobile: 75 },
  // { date: '2024-06-27', desktop: 420, mobile: 383 },
  // { date: '2024-06-28', desktop: 180, mobile: 122 },
  // { date: '2024-06-29', desktop: 315, mobile: 240 },
  // { date: '2024-06-30', desktop: 454, mobile: 380 },
  // { date: '2024-07-01', desktop: 220, mobile: 165 },
  // { date: '2024-07-02', desktop: 310, mobile: 293 },
  // { date: '2024-07-03', desktop: 247, mobile: 190 },
  // { date: '2024-07-04', desktop: 420, mobile: 385 },
  // { date: '2024-07-05', desktop: 481, mobile: 390 },
  // { date: '2024-07-06', desktop: 520, mobile: 489 },
  // { date: '2024-07-07', desktop: 388, mobile: 300 },
  // { date: '2024-07-08', desktop: 210, mobile: 149 },
  // { date: '2024-07-09', desktop: 227, mobile: 180 },
  // { date: '2024-07-10', desktop: 330, mobile: 293 },
  // { date: '2024-07-11', desktop: 335, mobile: 270 },
  // { date: '2024-07-12', desktop: 240, mobile: 197 },
  // { date: '2024-07-13', desktop: 197, mobile: 160 },
  // { date: '2024-07-14', desktop: 490, mobile: 448 },
  // { date: '2024-07-15', desktop: 473, mobile: 473 }
]

export interface AreaChartItem2 {
  hour: string
  temperature: number
}

export const AreaChartData2: AreaChartItem2[] = [
  { hour: '00:00', temperature: 12.8 },
  { hour: '01:00', temperature: 12.4 },
  { hour: '02:00', temperature: 12.2 },
  { hour: '03:00', temperature: 8.9 },
  { hour: '04:00', temperature: 8.7 },
  { hour: '05:00', temperature: 8.3 },
  { hour: '06:00', temperature: 8.3 },
  { hour: '07:00', temperature: 8.3 },
  { hour: '08:00', temperature: 10.5 },
  { hour: '09:00', temperature: 12.0 },
  { hour: '10:00', temperature: 13.0 },
  { hour: '11:00', temperature: 14.2 },
  { hour: '12:00', temperature: 15.5 },
  { hour: '13:00', temperature: 16.8 },
  { hour: '14:00', temperature: 17.5 },
  { hour: '15:00', temperature: 18.1 },
  { hour: '16:00', temperature: 18.2 },
  { hour: '17:00', temperature: 17.8 },
  { hour: '18:00', temperature: 17.2 },
  { hour: '19:00', temperature: 16.5 },
  { hour: '20:00', temperature: 15.8 },
  { hour: '21:00', temperature: 14.9 },
  { hour: '22:00', temperature: 14.2 },
  { hour: '23:00', temperature: 13.5 }
]

export const AreaChartData3 = [
  {
    time: '00:00',
    returning: 0,
    firstTime: 0
  },
  {
    time: '01:00',
    returning: 400,
    firstTime: 600
  },
  {
    time: '02:00',
    returning: 300,
    firstTime: 300
  },
  {
    time: '03:00',
    returning: 300,
    firstTime: 300
  },
  {
    time: '04:00',
    returning: 200,
    firstTime: 300
  },
  {
    time: '05:00',
    returning: 111,
    firstTime: 222
  },
  {
    time: '06:00',
    returning: 125,
    firstTime: 125
  },
  {
    time: '07:00',
    returning: 0,
    firstTime: 0
  },
  {
    time: '08:00',
    returning: 300,
    firstTime: 250
  },
  {
    time: '09:00',
    returning: 0,
    firstTime: 0
  },
  {
    time: '10:00',
    returning: 250,
    firstTime: 350
  },
  {
    time: '11:00',
    returning: 125,
    firstTime: 175
  },
  {
    time: '12:00',
    returning: 0,
    firstTime: 0
  },

  {
    time: '13:00',
    returning: 0,
    firstTime: 0
  },
  {
    time: '14:00',
    returning: 0,
    firstTime: 0
  },
  {
    time: '15:00',
    returning: 0,
    firstTime: 0
  },
  {
    time: '16:00',
    returning: 0,
    firstTime: 0
  },
  {
    time: '17:00',
    returning: 0,
    firstTime: 0
  },
  {
    time: '18:00',
    returning: 50,
    firstTime: 50
  },
  {
    time: '19:00',
    returning: 50,
    firstTime: 50
  },
  {
    time: '20:00',
    returning: 50,
    firstTime: 50
  },
  {
    time: '21:00',
    returning: 0,
    firstTime: 0
  },
  {
    time: '22:00',
    returning: 0,
    firstTime: 0
  },
  {
    time: '23:00',
    returning: 0,
    firstTime: 0
  },
  {
    time: '00:00',
    returning: 0,
    firstTime: 0
  }
]

export type AreaChartItem4 = {
  month: string;
  desktop: number
}
export const AreaChartData4: AreaChartItem4[] = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]