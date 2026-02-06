import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StatusDotComponent } from '@proto/ui-theme';
import { FeaturesFacade } from '@proto/features-state';
import { toSignal } from '@angular/core/rxjs-interop';
import { Feature } from '@proto/api-interfaces';

interface FeatureCard {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  port: number;
  accentVar: string;
  subtleVar: string;
  stats: { label: string; value: string }[];
  status: 'healthy' | 'degraded' | 'unhealthy';
}

interface ActivityItem {
  time: string;
  event: string;
  colorVar: string;
}

interface ArchitectureNode {
  label: string;
  abbr: string;
  colorVar: string;
  subLabel: string;
}

@Component({
  selector: 'proto-home',
  standalone: true,
  imports: [RouterModule, StatusDotComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly featuresFacade = inject(FeaturesFacade);
  protected readonly features = toSignal(this.featuresFacade.allFeatures$, { initialValue: [] as Feature[] });

  protected readonly hoveredFeature = signal<string | null>(null);

  protected readonly techStack = [
    'Angular 21',
    'NestJS',
    'Nx Monorepo',
    'Module Federation',
    'NgRx Signal Store',
    'TypeORM',
    'SQLite'
  ];

  protected readonly architectureNodes: ArchitectureNode[] = [
    { label: 'Ingress', abbr: 'ING', colorVar: '--accent-ingress', subLabel: 'Ingest' },
    { label: 'Transform', abbr: 'TRN', colorVar: '--accent-transform', subLabel: 'Process' },
    { label: 'Reporting', abbr: 'RPT', colorVar: '--accent-reporting', subLabel: 'Visualize' },
    { label: 'Export', abbr: 'EXP', colorVar: '--accent-export', subLabel: 'Output' },
  ];

  protected readonly activityFeed: ActivityItem[] = [
    { time: '14:32', event: "Pipeline 'Customer 360' completed — 198K records", colorVar: '--accent-transform' },
    { time: '14:31', event: 'Stripe sync batch 12/18 processing', colorVar: '--accent-ingress' },
    { time: '14:28', event: 'Daily Revenue Report exported (2.4 MB)', colorVar: '--accent-export' },
    { time: '14:23', event: 'Snowflake connection timeout — retry queued', colorVar: '--color-danger' },
    { time: '14:15', event: "Dashboard 'Revenue Overview' auto-refreshed", colorVar: '--accent-reporting' },
    { time: '14:02', event: 'Schema v3 validated for PostgreSQL source', colorVar: '--accent-ingress' },
    { time: '13:58', event: 'User marcus.j@globex.io invited by Emily Zhao', colorVar: '--accent-users' },
    { time: '13:45', event: 'Event Stream Processor — 12.4K records/sec', colorVar: '--accent-transform' },
  ];

  protected readonly featureCards = computed<FeatureCard[]>(() => {
    const featureConfigs: Record<string, Omit<FeatureCard, 'id' | 'name'>> = {
      ingress: {
        subtitle: 'Data Sources',
        description: 'Connect and manage external data sources. Monitor connection health, discover schemas, and configure sync schedules.',
        icon: '↓',
        port: 4202,
        accentVar: '--accent-ingress',
        subtleVar: '--accent-ingress-subtle',
        stats: [
          { label: 'Sources', value: '6' },
          { label: 'Active', value: '4' },
          { label: 'Records', value: '10.2M' },
          { label: 'Last Sync', value: '12s ago' },
        ],
        status: 'healthy',
      },
      transformation: {
        subtitle: 'Pipelines',
        description: 'Build data processing pipelines with configurable transform steps. Visual node editor with real-time preview.',
        icon: '⟐',
        port: 4203,
        accentVar: '--accent-transform',
        subtleVar: '--accent-transform-subtle',
        stats: [
          { label: 'Pipelines', value: '6' },
          { label: 'Active', value: '3' },
          { label: 'Runs', value: '2,847' },
          { label: 'Success', value: '99.2%' },
        ],
        status: 'healthy',
      },
      reporting: {
        subtitle: 'Dashboards',
        description: 'Create interactive dashboards with charts, tables, and KPI metrics. Real-time data visualization with configurable widgets.',
        icon: '◨',
        port: 4204,
        accentVar: '--accent-reporting',
        subtleVar: '--accent-reporting-subtle',
        stats: [
          { label: 'Dashboards', value: '4' },
          { label: 'Widgets', value: '23' },
          { label: 'Queries', value: '18' },
          { label: 'Refresh', value: '10s' },
        ],
        status: 'healthy',
      },
      export: {
        subtitle: 'Jobs & Scheduling',
        description: 'Export processed data in multiple formats. Schedule recurring jobs, track progress, and manage output files.',
        icon: '↗',
        port: 4205,
        accentVar: '--accent-export',
        subtleVar: '--accent-export-subtle',
        stats: [
          { label: 'Jobs', value: '8' },
          { label: 'Completed', value: '5' },
          { label: 'Size', value: '12.9 MB' },
          { label: 'Scheduled', value: '4' },
        ],
        status: 'degraded',
      },
      users: {
        subtitle: 'Management',
        description: 'Manage user accounts, role-based access controls, and company tenancy. JWT authentication with four permission tiers.',
        icon: '◉',
        port: 4201,
        accentVar: '--accent-users',
        subtleVar: '--accent-users-subtle',
        stats: [
          { label: 'Users', value: '12' },
          { label: 'Active', value: '10' },
          { label: 'Companies', value: '4' },
          { label: 'Admins', value: '5' },
        ],
        status: 'healthy',
      },
    };

    return this.features()
      .filter(f => featureConfigs[f.slug])
      .map(f => ({
        id: f.slug,
        name: f.title,
        ...featureConfigs[f.slug],
      }));
  });

  protected readonly topRowCards = computed(() => this.featureCards().slice(0, 3));
  protected readonly bottomRowCards = computed(() => this.featureCards().slice(3, 5));

  ngOnInit() {
    this.featuresFacade.loadFeatures();
  }
}
