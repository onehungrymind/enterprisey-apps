import { DataSource, DataSourceOptions, getMetadataArgsStorage } from 'typeorm';

import { Dashboard } from './entities/dashboard.entity';
import { Widget } from './entities/widget.entity';
import { ReportQuery } from './entities/report-query.entity';

const options: DataSourceOptions = {
  type: 'better-sqlite3',
  database: './databases/reporting.sqlite',
  synchronize: true,
  logging: false,
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);

  const queryRepository = dataSource.getRepository(ReportQuery);
  const dashboardRepository = dataSource.getRepository(Dashboard);
  const widgetRepository = dataSource.getRepository(Widget);

  console.log('Seeding queries...');

  // ============================================
  // QUERIES - Various data aggregations
  // ============================================

  const queryMonthlyRevenue = await queryRepository.save({
    name: 'Monthly Revenue',
    pipelineId: 'pipeline-001',
    aggregation: {
      groupBy: ['month'],
      metrics: [{ field: 'revenue', function: 'sum', alias: 'total_revenue' }],
    },
    filters: [],
    cachedAt: new Date().toISOString(),
    cacheDuration: 3600,
  });

  const querySegmentBreakdown = await queryRepository.save({
    name: 'Customer Segments',
    pipelineId: 'pipeline-002',
    aggregation: {
      groupBy: ['segment'],
      metrics: [{ field: 'customer_count', function: 'sum', alias: 'count' }],
    },
    filters: [],
    cachedAt: new Date().toISOString(),
    cacheDuration: 1800,
  });

  const queryDealsByMonth = await queryRepository.save({
    name: 'Monthly Deals',
    pipelineId: 'pipeline-003',
    aggregation: {
      groupBy: ['month'],
      metrics: [
        { field: 'deal_value', function: 'sum', alias: 'total_value' },
        { field: 'customer_count', function: 'sum', alias: 'deal_count' },
      ],
    },
    filters: [],
    cachedAt: new Date().toISOString(),
    cacheDuration: 7200,
  });

  const queryRegionRevenue = await queryRepository.save({
    name: 'Revenue by Region',
    pipelineId: 'pipeline-001',
    aggregation: {
      groupBy: ['region'],
      metrics: [{ field: 'revenue', function: 'sum', alias: 'revenue' }],
    },
    filters: [],
    cachedAt: new Date().toISOString(),
    cacheDuration: 3600,
  });

  const queryProductPerformance = await queryRepository.save({
    name: 'Product Performance',
    pipelineId: 'pipeline-004',
    aggregation: {
      groupBy: ['product'],
      metrics: [
        { field: 'units_sold', function: 'sum', alias: 'units' },
        { field: 'revenue', function: 'sum', alias: 'revenue' },
      ],
    },
    filters: [],
    cachedAt: new Date().toISOString(),
    cacheDuration: 3600,
  });

  const queryDailyActiveUsers = await queryRepository.save({
    name: 'Daily Active Users',
    pipelineId: 'pipeline-005',
    aggregation: {
      groupBy: ['day'],
      metrics: [{ field: 'active_users', function: 'sum', alias: 'dau' }],
    },
    filters: [],
    cachedAt: new Date().toISOString(),
    cacheDuration: 900,
  });

  const queryConversionFunnel = await queryRepository.save({
    name: 'Conversion Funnel',
    pipelineId: 'pipeline-006',
    aggregation: {
      groupBy: ['stage'],
      metrics: [{ field: 'users', function: 'sum', alias: 'users' }],
    },
    filters: [],
    cachedAt: new Date().toISOString(),
    cacheDuration: 1800,
  });

  const queryChurnByMonth = await queryRepository.save({
    name: 'Monthly Churn',
    pipelineId: 'pipeline-007',
    aggregation: {
      groupBy: ['month'],
      metrics: [
        { field: 'churned', function: 'sum', alias: 'churned' },
        { field: 'total', function: 'sum', alias: 'total' },
      ],
    },
    filters: [],
    cachedAt: new Date().toISOString(),
    cacheDuration: 3600,
  });

  const queryTicketsByCategory = await queryRepository.save({
    name: 'Support Tickets by Category',
    pipelineId: 'pipeline-008',
    aggregation: {
      groupBy: ['category'],
      metrics: [{ field: 'ticket_count', function: 'sum', alias: 'tickets' }],
    },
    filters: [],
    cachedAt: new Date().toISOString(),
    cacheDuration: 1800,
  });

  const queryResponseTime = await queryRepository.save({
    name: 'Avg Response Time',
    pipelineId: 'pipeline-008',
    aggregation: {
      groupBy: ['day'],
      metrics: [{ field: 'response_time', function: 'avg', alias: 'avg_response' }],
    },
    filters: [],
    cachedAt: new Date().toISOString(),
    cacheDuration: 1800,
  });

  console.log('Seeding dashboards...');

  // ============================================
  // DASHBOARD 1: Executive Summary
  // ============================================
  const dashboardExec = await dashboardRepository.save({
    name: 'Executive Summary',
    description: 'High-level KPIs and business health metrics',
    widgets: [],
    filters: [],
    createdBy: 'ceo@company.com',
    isPublic: true,
  });

  await widgetRepository.save([
    {
      dashboardId: dashboardExec.id,
      type: 'metric',
      title: 'Total Revenue',
      queryId: queryMonthlyRevenue.id,
      config: { aggregation: 'sum', format: 'currency', change: '+15.3%', positive: true },
      position: { x: 0, y: 0, w: 3, h: 2 },
    },
    {
      dashboardId: dashboardExec.id,
      type: 'metric',
      title: 'Active Customers',
      queryId: querySegmentBreakdown.id,
      config: { aggregation: 'sum', format: 'number', change: '+8.2%', positive: true },
      position: { x: 3, y: 0, w: 3, h: 2 },
    },
    {
      dashboardId: dashboardExec.id,
      type: 'metric',
      title: 'Deals Closed',
      queryId: queryDealsByMonth.id,
      config: { aggregation: 'sum', format: 'number', valueField: 'deal_count', change: '+22.1%', positive: true },
      position: { x: 6, y: 0, w: 3, h: 2 },
    },
    {
      dashboardId: dashboardExec.id,
      type: 'metric',
      title: 'Monthly Churn',
      queryId: queryChurnByMonth.id,
      config: { aggregation: 'sum', format: 'number', valueField: 'churned', change: '-2.4%', positive: true },
      position: { x: 9, y: 0, w: 3, h: 2 },
    },
    {
      dashboardId: dashboardExec.id,
      type: 'line_chart',
      title: 'Revenue Trend',
      queryId: queryMonthlyRevenue.id,
      config: { xAxis: 'month', yAxis: 'total_revenue' },
      position: { x: 0, y: 2, w: 8, h: 4 },
    },
    {
      dashboardId: dashboardExec.id,
      type: 'pie_chart',
      title: 'Revenue by Region',
      queryId: queryRegionRevenue.id,
      config: { labelField: 'region', valueField: 'revenue' },
      position: { x: 8, y: 2, w: 4, h: 4 },
    },
  ]);

  // ============================================
  // DASHBOARD 2: Sales Performance
  // ============================================
  const dashboardSales = await dashboardRepository.save({
    name: 'Sales Performance',
    description: 'Sales team metrics, pipeline, and deal tracking',
    widgets: [],
    filters: [],
    createdBy: 'sales-lead@company.com',
    isPublic: true,
  });

  await widgetRepository.save([
    {
      dashboardId: dashboardSales.id,
      type: 'metric',
      title: 'Total Deal Value',
      queryId: queryDealsByMonth.id,
      config: { aggregation: 'sum', format: 'currency', valueField: 'total_value', change: '+18.7%', positive: true },
      position: { x: 0, y: 0, w: 4, h: 2 },
    },
    {
      dashboardId: dashboardSales.id,
      type: 'metric',
      title: 'Deals Won',
      queryId: queryDealsByMonth.id,
      config: { aggregation: 'sum', format: 'number', valueField: 'deal_count', change: '+12.3%', positive: true },
      position: { x: 4, y: 0, w: 4, h: 2 },
    },
    {
      dashboardId: dashboardSales.id,
      type: 'metric',
      title: 'Avg Deal Size',
      queryId: queryDealsByMonth.id,
      config: { aggregation: 'avg', format: 'currency', valueField: 'total_value', change: '+5.6%', positive: true },
      position: { x: 8, y: 0, w: 4, h: 2 },
    },
    {
      dashboardId: dashboardSales.id,
      type: 'bar_chart',
      title: 'Monthly Revenue',
      queryId: queryMonthlyRevenue.id,
      config: { xAxis: 'month', yAxis: 'total_revenue' },
      position: { x: 0, y: 2, w: 6, h: 4 },
    },
    {
      dashboardId: dashboardSales.id,
      type: 'line_chart',
      title: 'Deal Value Trend',
      queryId: queryDealsByMonth.id,
      config: { xAxis: 'month', yAxis: 'total_value' },
      position: { x: 6, y: 2, w: 6, h: 4 },
    },
    {
      dashboardId: dashboardSales.id,
      type: 'pie_chart',
      title: 'Deals by Segment',
      queryId: querySegmentBreakdown.id,
      config: { labelField: 'segment', valueField: 'count' },
      position: { x: 0, y: 6, w: 4, h: 4 },
    },
    {
      dashboardId: dashboardSales.id,
      type: 'table',
      title: 'Top Products',
      queryId: queryProductPerformance.id,
      config: { columns: ['product', 'units', 'revenue'] },
      position: { x: 4, y: 6, w: 8, h: 4 },
    },
  ]);

  // ============================================
  // DASHBOARD 3: Product Analytics
  // ============================================
  const dashboardProduct = await dashboardRepository.save({
    name: 'Product Analytics',
    description: 'User engagement, feature adoption, and product health',
    widgets: [],
    filters: [],
    createdBy: 'product@company.com',
    isPublic: true,
  });

  await widgetRepository.save([
    {
      dashboardId: dashboardProduct.id,
      type: 'metric',
      title: 'Daily Active Users',
      queryId: queryDailyActiveUsers.id,
      config: { aggregation: 'sum', format: 'number', change: '+4.8%', positive: true },
      position: { x: 0, y: 0, w: 3, h: 2 },
    },
    {
      dashboardId: dashboardProduct.id,
      type: 'metric',
      title: 'Conversion Rate',
      queryId: queryConversionFunnel.id,
      config: { aggregation: 'sum', format: 'percent', change: '+1.2%', positive: true },
      position: { x: 3, y: 0, w: 3, h: 2 },
    },
    {
      dashboardId: dashboardProduct.id,
      type: 'metric',
      title: 'Feature Adoption',
      queryId: queryDailyActiveUsers.id,
      config: { aggregation: 'sum', format: 'percent', change: '+6.7%', positive: true },
      position: { x: 6, y: 0, w: 3, h: 2 },
    },
    {
      dashboardId: dashboardProduct.id,
      type: 'metric',
      title: 'Session Duration',
      queryId: queryDailyActiveUsers.id,
      config: { aggregation: 'avg', format: 'number', change: '+12s', positive: true },
      position: { x: 9, y: 0, w: 3, h: 2 },
    },
    {
      dashboardId: dashboardProduct.id,
      type: 'line_chart',
      title: 'DAU Trend',
      queryId: queryDailyActiveUsers.id,
      config: { xAxis: 'day', yAxis: 'dau' },
      position: { x: 0, y: 2, w: 8, h: 4 },
    },
    {
      dashboardId: dashboardProduct.id,
      type: 'bar_chart',
      title: 'Conversion Funnel',
      queryId: queryConversionFunnel.id,
      config: { xAxis: 'stage', yAxis: 'users' },
      position: { x: 8, y: 2, w: 4, h: 4 },
    },
    {
      dashboardId: dashboardProduct.id,
      type: 'pie_chart',
      title: 'Users by Segment',
      queryId: querySegmentBreakdown.id,
      config: { labelField: 'segment', valueField: 'count' },
      position: { x: 0, y: 6, w: 4, h: 4 },
    },
    {
      dashboardId: dashboardProduct.id,
      type: 'text',
      title: 'Product Notes',
      queryId: null,
      config: { content: 'New onboarding flow launched last week. Monitoring conversion rate closely. A/B test results expected by Friday.' },
      position: { x: 4, y: 6, w: 8, h: 4 },
    },
  ]);

  // ============================================
  // DASHBOARD 4: Customer Support
  // ============================================
  const dashboardSupport = await dashboardRepository.save({
    name: 'Customer Support',
    description: 'Support ticket metrics, response times, and satisfaction',
    widgets: [],
    filters: [],
    createdBy: 'support-lead@company.com',
    isPublic: true,
  });

  await widgetRepository.save([
    {
      dashboardId: dashboardSupport.id,
      type: 'metric',
      title: 'Open Tickets',
      queryId: queryTicketsByCategory.id,
      config: { aggregation: 'sum', format: 'number', change: '-15', positive: true },
      position: { x: 0, y: 0, w: 3, h: 2 },
    },
    {
      dashboardId: dashboardSupport.id,
      type: 'metric',
      title: 'Avg Response Time',
      queryId: queryResponseTime.id,
      config: { aggregation: 'avg', format: 'number', valueField: 'avg_response', change: '-2.3h', positive: true },
      position: { x: 3, y: 0, w: 3, h: 2 },
    },
    {
      dashboardId: dashboardSupport.id,
      type: 'metric',
      title: 'Resolution Rate',
      queryId: queryTicketsByCategory.id,
      config: { aggregation: 'sum', format: 'percent', change: '+3.2%', positive: true },
      position: { x: 6, y: 0, w: 3, h: 2 },
    },
    {
      dashboardId: dashboardSupport.id,
      type: 'metric',
      title: 'CSAT Score',
      queryId: queryTicketsByCategory.id,
      config: { aggregation: 'avg', format: 'number', change: '+0.2', positive: true },
      position: { x: 9, y: 0, w: 3, h: 2 },
    },
    {
      dashboardId: dashboardSupport.id,
      type: 'pie_chart',
      title: 'Tickets by Category',
      queryId: queryTicketsByCategory.id,
      config: { labelField: 'category', valueField: 'tickets' },
      position: { x: 0, y: 2, w: 4, h: 4 },
    },
    {
      dashboardId: dashboardSupport.id,
      type: 'line_chart',
      title: 'Response Time Trend',
      queryId: queryResponseTime.id,
      config: { xAxis: 'day', yAxis: 'avg_response' },
      position: { x: 4, y: 2, w: 8, h: 4 },
    },
    {
      dashboardId: dashboardSupport.id,
      type: 'bar_chart',
      title: 'Tickets by Category',
      queryId: queryTicketsByCategory.id,
      config: { xAxis: 'category', yAxis: 'tickets' },
      position: { x: 0, y: 6, w: 6, h: 4 },
    },
    {
      dashboardId: dashboardSupport.id,
      type: 'text',
      title: 'Weekly Summary',
      queryId: null,
      config: { content: 'Response times improved by 15% this week. New knowledge base articles reduced repeat tickets for billing questions. Team achieved 98% SLA compliance.' },
      position: { x: 6, y: 6, w: 6, h: 4 },
    },
  ]);

  // ============================================
  // DASHBOARD 5: Marketing Overview
  // ============================================
  const dashboardMarketing = await dashboardRepository.save({
    name: 'Marketing Overview',
    description: 'Campaign performance, lead generation, and marketing ROI',
    widgets: [],
    filters: [],
    createdBy: 'marketing@company.com',
    isPublic: true,
  });

  await widgetRepository.save([
    {
      dashboardId: dashboardMarketing.id,
      type: 'metric',
      title: 'New Leads',
      queryId: querySegmentBreakdown.id,
      config: { aggregation: 'sum', format: 'number', change: '+234', positive: true },
      position: { x: 0, y: 0, w: 3, h: 2 },
    },
    {
      dashboardId: dashboardMarketing.id,
      type: 'metric',
      title: 'Marketing ROI',
      queryId: queryMonthlyRevenue.id,
      config: { aggregation: 'sum', format: 'percent', change: '+18%', positive: true },
      position: { x: 3, y: 0, w: 3, h: 2 },
    },
    {
      dashboardId: dashboardMarketing.id,
      type: 'metric',
      title: 'Cost per Lead',
      queryId: queryMonthlyRevenue.id,
      config: { aggregation: 'avg', format: 'currency', change: '-$12', positive: true },
      position: { x: 6, y: 0, w: 3, h: 2 },
    },
    {
      dashboardId: dashboardMarketing.id,
      type: 'metric',
      title: 'Email Open Rate',
      queryId: queryConversionFunnel.id,
      config: { aggregation: 'avg', format: 'percent', change: '+2.1%', positive: true },
      position: { x: 9, y: 0, w: 3, h: 2 },
    },
    {
      dashboardId: dashboardMarketing.id,
      type: 'line_chart',
      title: 'Lead Generation Trend',
      queryId: queryDailyActiveUsers.id,
      config: { xAxis: 'day', yAxis: 'dau' },
      position: { x: 0, y: 2, w: 6, h: 4 },
    },
    {
      dashboardId: dashboardMarketing.id,
      type: 'bar_chart',
      title: 'Leads by Source',
      queryId: querySegmentBreakdown.id,
      config: { xAxis: 'segment', yAxis: 'count' },
      position: { x: 6, y: 2, w: 6, h: 4 },
    },
    {
      dashboardId: dashboardMarketing.id,
      type: 'pie_chart',
      title: 'Campaign Performance',
      queryId: queryRegionRevenue.id,
      config: { labelField: 'region', valueField: 'revenue' },
      position: { x: 0, y: 6, w: 4, h: 4 },
    },
    {
      dashboardId: dashboardMarketing.id,
      type: 'table',
      title: 'Top Campaigns',
      queryId: queryProductPerformance.id,
      config: { columns: ['product', 'units', 'revenue'] },
      position: { x: 4, y: 6, w: 8, h: 4 },
    },
  ]);

  console.log('Seeding complete!');
  console.log(`Created ${await queryRepository.count()} queries`);
  console.log(`Created ${await dashboardRepository.count()} dashboards`);
  console.log(`Created ${await widgetRepository.count()} widgets`);

  process.exit();
});
