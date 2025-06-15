import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TelemetryChartProps {
  data: Array<{
    timestamp: string;
    fuel: number;
    temperature: number;
    systemHealth: number;
    batteryLevel: number;
  }>;
  metric: 'fuel' | 'temperature' | 'systemHealth' | 'batteryLevel';
  title: string;
  color: string;
  unit?: string;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({
  data,
  metric,
  title,
  color,
  unit = ''
}) => {
  const chartData = {
    labels: data.map(d => d.timestamp),
    datasets: [
      {
        label: title,
        data: data.map(d => d[metric]),
        borderColor: color,
        backgroundColor: color + '20',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: color,
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `${title}: ${context.parsed.y}${unit}`
        }
      }
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11
          },
          callback: (value: any) => `${value}${unit}`
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: color
      }
    }
  };

  return (
    <div className="h-32">
      <Line data={chartData} options={options} />
    </div>
  );
};