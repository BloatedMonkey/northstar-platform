/**
 * @author Arman Hazrati
 * Main dashboard page
 */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Users, FileText, CheckCircle, Clock, TrendingUp, Activity } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12.5%',
      icon: Users,
      color: 'blue' as const,
    },
    {
      title: 'Service Requests',
      value: '1,234',
      change: '+8.2%',
      icon: FileText,
      color: 'green' as const,
    },
    {
      title: 'Completed',
      value: '892',
      change: '+15.3%',
      icon: CheckCircle,
      color: 'purple' as const,
    },
    {
      title: 'Pending',
      value: '342',
      change: '-3.1%',
      icon: Clock,
      color: 'yellow' as const,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="mt-1 text-gray-600">
            Here&apos;s what&apos;s happening with your platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Charts and Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Performance Chart */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex h-64 items-center justify-center text-gray-500">
              <Activity className="mr-2 h-8 w-8" />
              <span>Chart visualization will be rendered here</span>
            </div>
          </div>

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>
    </DashboardLayout>
  );
}
