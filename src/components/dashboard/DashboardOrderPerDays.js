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
import { useGetDashboardCount } from '../../hooks/api/useDashboard';

const initialChartData = [
  {
    day: 'monday',
    total: 0,
  },
  {
    day: 'tuesday',
    total: 0,
  },
  {
    day: 'wednesday',
    total: 0,
  },
  {
    day: 'thursday',
    total: 0,
  },
  {
    day: 'friday',
    total: 0,
  },
  {
    day: 'saturday',
    total: 0,
  },
  {
    day: 'sunday',
    total: 0,
  },
];

const getFormattedChartData = (data) => {
  if (data) {
    const newChartData = [...initialChartData];
    data?.forEach((d) => {
      const updateIndex = newChartData?.findIndex((chart) => chart?.day === d?.day?.trim());
      newChartData[updateIndex].total = d?.total;
    });

    return newChartData;
  }
};

export default function DashboardOrderPerDays() {
  // ** Fetch data on mount
  const { data } = useGetDashboardCount();

  const { orderDaily } = data?.data || {};

  const chartData = getFormattedChartData(orderDaily);

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

  return (
    <Card>
      <CardHeader title="Pesanan Perhari" />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={[{ data: series }]} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
