import { MetricsService } from '@/lib/metrics/metricsService';

export async function GET() {
  try {
    const metrics = MetricsService.getInstance();
    const { alerts, status } = metrics.checkAlertConditions();
    
    return Response.json({
      status,
      alerts,
      metrics: metrics.exportMetrics(),
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return Response.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}