import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

interface AnalyticsData {
  total_registrations: number;
  status_distribution: Record<string, number>;
  college_distribution: Record<string, number>;
  year_distribution: Record<string, number>;
  timestamp: string;
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await apiClient('/analytics/registrations');
        setAnalytics(JSON.parse(data));
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (!analytics) return <div>No analytics data available</div>;

  return (
    <div className='bg-white rounded-xl shadow-lg p-6'>
      <h2 className='text-2xl font-bold text-gray-900 font-serif mb-4'>
        Registration Analytics
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <h3 className='text-lg font-semibold mb-2'>Total Registrations</h3>
          <p className='text-3xl font-bold text-stone-700'>
            {analytics.total_registrations}
          </p>
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-2'>Status Distribution</h3>
          {Object.entries(analytics.status_distribution).map(
            ([status, count]) => (
              <div
                key={status}
                className='flex justify-between items-center mb-2'
              >
                <span className='capitalize'>{status}</span>
                <span className='font-bold'>{count}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
