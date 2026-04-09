'use client';

import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface OrbitalPlotProps {
  data?: {
    time: string[];
    azimuth: number[];
    elevation: number[];
  };
}

export default function OrbitalPlot({ data }: OrbitalPlotProps) {
  const chartRef = useRef<ChartJS<'line', number[], unknown> | null>(null);

  const chartData = {
    labels: data?.time || [],
    datasets: [
      {
        label: 'Elevation (°)',
        data: data?.elevation || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        yAxisID: 'y',
        tension: 0.4,
      },
      {
        label: 'Azimuth (°)',
        data: data?.azimuth || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y1',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Satellite Position Over Time',
      },
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Elevation (°)',
        },
        min: -10,
        max: 90,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Azimuth (°)',
        },
        min: 0,
        max: 360,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (!data || data.time.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md transition-colors">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Orbital Plot</h2>
        <div className="text-center text-gray-500 dark:text-gray-400 py-16">
          No data available. Select a satellite and location to view the orbital plot.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md transition-colors">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Orbital Plot</h2>
      <div className="h-80">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
}