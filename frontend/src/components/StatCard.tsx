import React from 'react';
import { ComponentType } from 'react';

interface StatCardProps {
  name: string;
  value: number | string;
  icon: ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
}

const StatCard: React.FC<StatCardProps> = ({ name, value, icon: Icon, color, change }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`${color} rounded-md p-3`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{name}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {change && (
                  <div
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {change.type === 'increase' ? '↑' : '↓'}
                    {change.value}%
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
