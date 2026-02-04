import { DataSource, DataSourceOptions, getMetadataArgsStorage } from 'typeorm';

import { Dashboard } from './entities/dashboard.entity';
import { Widget } from './entities/widget.entity';
import { ReportQuery } from './entities/report-query.entity';

const options: DataSourceOptions = {
  type: 'better-sqlite3',
  database: './databases/reporting.sqlite',
  synchronize: true,
  logging: true,
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);

  const queryRepository = dataSource.getRepository(ReportQuery);
  const dashboardRepository = dataSource.getRepository(Dashboard);
  const widgetRepository = dataSource.getRepository(Widget);

  // Seed ReportQueries
  const query1 = await queryRepository.save({
    name: 'Monthly Revenue',
    pipelineId: 'pipeline-001',
    aggregation: { type: 'sum', field: 'revenue', groupBy: 'month' },
    filters: { dateRange: { start: '2025-01-01', end: '2025-12-31' } },
    cachedAt: new Date().toISOString(),
    cacheDuration: 3600,
  });

  const query2 = await queryRepository.save({
    name: 'User Signups by Region',
    pipelineId: 'pipeline-002',
    aggregation: { type: 'count', field: 'userId', groupBy: 'region' },
    filters: { status: 'active' },
    cachedAt: new Date().toISOString(),
    cacheDuration: 1800,
  });

  const query3 = await queryRepository.save({
    name: 'Top Products',
    pipelineId: 'pipeline-003',
    aggregation: { type: 'sum', field: 'quantity', groupBy: 'productName', orderBy: 'desc', limit: 10 },
    filters: { category: 'electronics' },
    cachedAt: new Date().toISOString(),
    cacheDuration: 7200,
  });

  // Seed Dashboard 1
  const dashboard1 = await dashboardRepository.save({
    name: 'Revenue Overview',
    description: 'Executive dashboard for revenue metrics and trends',
    widgets: [],
    filters: [{ field: 'dateRange', operator: 'between', value: ['2025-01-01', '2025-12-31'] }],
    createdBy: 'admin@example.com',
    isPublic: true,
  });

  // Seed Widgets for Dashboard 1
  await widgetRepository.save([
    {
      dashboardId: dashboard1.id,
      type: 'line_chart',
      title: 'Monthly Revenue Trend',
      queryId: query1.id,
      config: { xAxis: 'month', yAxis: 'total_revenue', color: '#4CAF50' },
      position: { x: 0, y: 0, w: 6, h: 4 },
    },
    {
      dashboardId: dashboard1.id,
      type: 'metric',
      title: 'Total Revenue YTD',
      queryId: query1.id,
      config: { aggregation: 'sum', format: 'currency', prefix: '$' },
      position: { x: 6, y: 0, w: 3, h: 2 },
    },
    {
      dashboardId: dashboard1.id,
      type: 'bar_chart',
      title: 'Revenue by Month',
      queryId: query1.id,
      config: { xAxis: 'month', yAxis: 'total_revenue', color: '#2196F3' },
      position: { x: 6, y: 2, w: 3, h: 2 },
    },
    {
      dashboardId: dashboard1.id,
      type: 'text',
      title: 'Notes',
      queryId: null,
      config: { content: 'Revenue targets are on track for Q1 2025.' },
      position: { x: 9, y: 0, w: 3, h: 4 },
    },
  ]);

  // Seed Dashboard 2
  const dashboard2 = await dashboardRepository.save({
    name: 'Product Analytics',
    description: 'Product performance and user engagement metrics',
    widgets: [],
    filters: [{ field: 'category', operator: 'eq', value: 'electronics' }],
    createdBy: 'analyst@example.com',
    isPublic: false,
  });

  // Seed Widgets for Dashboard 2
  await widgetRepository.save([
    {
      dashboardId: dashboard2.id,
      type: 'pie_chart',
      title: 'Users by Region',
      queryId: query2.id,
      config: { labelField: 'region', valueField: 'count', showLegend: true },
      position: { x: 0, y: 0, w: 4, h: 4 },
    },
    {
      dashboardId: dashboard2.id,
      type: 'table',
      title: 'Top Products',
      queryId: query3.id,
      config: { columns: ['productName', 'quantity', 'revenue'], sortBy: 'quantity', sortOrder: 'desc' },
      position: { x: 4, y: 0, w: 8, h: 4 },
    },
    {
      dashboardId: dashboard2.id,
      type: 'metric',
      title: 'Total Signups',
      queryId: query2.id,
      config: { aggregation: 'sum', format: 'number' },
      position: { x: 0, y: 4, w: 4, h: 2 },
    },
  ]);

  console.log('Seeding complete!');
  process.exit();
});
