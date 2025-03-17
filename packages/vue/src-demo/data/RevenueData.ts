import { BulletLegendItemInterface } from "@unovis/ts";

export const categories: Record<string, BulletLegendItemInterface> = {
  value: { name: 'Value', color: '#05DF72' },
}

export const RevenueData = [
    { date: '16/12/25', value: 60000 },
    { date: '08/12/25', value: 40000 },
    { date: '30/11/25', value: 40000 },
    { date: '22/11/25', value: 30000 },
    { date: '14/11/25', value: 65000 },
    { date: '06/11/25', value: 90000 },
    { date: '29/10/25', value: 35000 },
    { date: '21/10/25', value: 25000 },
    { date: '13/10/25', value: 60000 },
    { date: '05/10/25', value: 55000 },
    { date: '27/09/25', value: 110000 },
    { date: '19/09/25', value: 60000 },
    { date: '11/09/25', value: 50000 },
    { date: '03/09/25', value: 80000 },
    { date: '26/08/25', value: 30000 }, // Estimated
    { date: '18/08/25', value: 45000 }, // Estimated
    { date: '10/08/25', value: 55000 }, // Estimated
    { date: '02/08/25', value: 70000 }, // Estimated
    { date: '25/07/25', value: 40000 }, // Estimated
    { date: '17/07/25', value: 60000 }, // Estimated
    { date: '09/07/25', value: 35000 }, // Estimated
    { date: '01/07/25', value: 50000 }, // Estimated
    { date: '23/06/25', value: 65000 }, // Estimated
    { date: '15/06/25', value: 80000 }, // Estimated
    { date: '07/06/25', value: 45000 }, // Estimated
    { date: '30/05/25', value: 75000 }, // Estimated
    { date: '22/05/25', value: 55000 }, // Estimated
    { date: '14/05/25', value: 60000 }, // Estimated
    { date: '06/05/25', value: 40000 }, // Estimated
    { date: '28/04/25', value: 30000 }, // Estimated
    { date: '20/04/25', value: 50000 }, // Estimated
    { date: '12/04/25', value: 70000 }, // Estimated
    { date: '04/04/25', value: 65000 }, // Estimated
    { date: '27/03/25', value: 85000 }, // Estimated
    { date: '19/03/25', value: 55000 }, // Estimated
    { date: '11/03/25', value: 45000 }, // Estimated
    { date: '03/03/25', value: 60000 }, // Estimated
    { date: '25/02/25', value: 35000 }, // Estimated
    { date: '16/02/25', value: 50000 }, // Estimated
    { date: '08/02/25', value: 75000 }, // Estimated
    { date: '31/01/25', value: 65000 }, // Estimated
    { date: '23/01/25', value: 40000 }, // Estimated
    { date: '15/01/25', value: 55000 }, // Estimated
    { date: '07/01/25', value: 80000 }, // Estimated
    { date: '30/12/24', value: 70000 }, // Estimated
    { date: '22/12/24', value: 60000 }, // Estimated
    { date: '14/12/24', value: 45000 }, // Estimated
    { date: '06/12/24', value: 55000 }, // Estimated
  ].reverse();

  export const RevenueDataSmall =  RevenueData.slice(0, 3);