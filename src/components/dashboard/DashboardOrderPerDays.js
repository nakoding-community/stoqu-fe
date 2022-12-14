import { useEffect, useState } from 'react';
import startCase from 'lodash/startCase';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import { BaseOptionChart } from '../chart';
import { fNumber } from '../../utils/formatNumber';
import { getDashboardOrderLastWeek } from '../../client/dashboardClient';

const initialChartData = [
  {
    day: 'senin',
    total: 0,
  },
  {
    day: 'selasa',
    total: 0,
  },
  {
    day: 'rabu',
    total: 0,
  },
  {
    day: 'kamis',
    total: 0,
  },
  {
    day: "jum'at",
    total: 0,
  },
  {
    day: 'sabtu',
    total: 0,
  },
  {
    day: 'minggu',
    total: 0,
  },
];

export default function DashboardOrderPerDays() {
  const [chartData, setChartData] = useState(initialChartData);

  const days =
    chartData?.map((chart) => {
      return startCase(chart?.day);
    }) || [];

  const series = chartData?.map((chart) => {
    return chart?.total;
  });

  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: () => '',
        },
      },
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 },
    },
    xaxis: {
      categories: days,
    },
  });

  const getDashboardOrderLastWeekHandler = async () => {
    const { data } = await getDashboardOrderLastWeek();

    if (data) {
      const copyChartData = [...chartData];
      data?.forEach((d) => {
        const updateIndex = copyChartData?.findIndex((chart) => chart?.day === d?.day);
        copyChartData[updateIndex].total = d?.total;
      });
      setChartData(copyChartData);
    }
  };

  useEffect(() => {
    getDashboardOrderLastWeekHandler();
  }, []);

  return (
    <Card>
      <CardHeader title="Pesanan Perhari" />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={[{ data: series }]} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
