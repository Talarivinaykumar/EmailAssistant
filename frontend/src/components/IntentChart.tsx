import React from 'react';

interface IntentChartData {
  name: string;
  value: number;
}

interface IntentChartProps {
  data: IntentChartData[];
}

const IntentChart: React.FC<IntentChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-gray-500',
  ];

  if (total === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const percentage = total > 0 ? (item.value / total) * 100 : 0;
        const color = colors[index % colors.length];
        
        return (
          <div key={item.name} className="flex items-center">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-sm text-gray-500 ml-2">{item.value}</p>
              </div>
              <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IntentChart;
