/**
 * @author Arman Hazrati
 * Recent activity feed component
 */
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Activity {
  id: string;
  type: 'created' | 'completed' | 'pending' | 'cancelled';
  title: string;
  description: string;
  timestamp: Date;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'completed',
    title: 'Service Request Completed',
    description: 'John Doe completed plumbing service request #1234',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '2',
    type: 'created',
    title: 'New Service Request',
    description: 'Jane Smith created a new electrical service request',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: '3',
    type: 'pending',
    title: 'Request Pending Review',
    description: 'HVAC service request #1235 is awaiting approval',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '4',
    type: 'cancelled',
    title: 'Request Cancelled',
    description: 'Customer cancelled service request #1236',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
];

const activityConfig = {
  created: { icon: FileText, color: 'text-blue-600 bg-blue-100' },
  completed: { icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  pending: { icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
  cancelled: { icon: XCircle, color: 'text-red-600 bg-red-100' },
};

export function RecentActivity() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h2>
      <div className="space-y-4">
        {mockActivities.map((activity) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`rounded-lg p-2 ${config.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {format(activity.timestamp, 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <button className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
        View All Activity
      </button>
    </div>
  );
}
