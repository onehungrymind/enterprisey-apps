import { Component, signal, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StatusDotComponent } from '@proto/ui-theme';

interface DomainTestResult {
  domain: string;
  icon: string;
  accentVar: string;
  subtleVar: string;
  featureFiles: string[];
  totalScenarios: number;
  passed: number;
  failed: number;
  skipped: number;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'inactive';
}

interface TestSummary {
  totalScenarios: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
  lastRun: string;
}

@Component({
  selector: 'proto-test-status',
  standalone: true,
  imports: [RouterModule, StatusDotComponent],
  templateUrl: './test-status.component.html',
  styleUrl: './test-status.component.scss'
})
export default class TestStatusComponent {
  protected readonly summary = signal<TestSummary>({
    totalScenarios: 755,
    passed: 0,
    failed: 23,
    skipped: 732,
    duration: '~5m',
    lastRun: new Date().toISOString().split('T')[0]
  });

  protected readonly domainResults = signal<DomainTestResult[]>([
    {
      domain: 'Auth',
      icon: '🔐',
      accentVar: '--accent-users',
      subtleVar: '--accent-users-subtle',
      featureFiles: ['login.feature', 'logout.feature', 'token-validation.feature'],
      totalScenarios: 34,
      passed: 0,
      failed: 2,
      skipped: 32,
      status: 'unhealthy'
    },
    {
      domain: 'Ingress',
      icon: '↓',
      accentVar: '--accent-ingress',
      subtleVar: '--accent-ingress-subtle',
      featureFiles: ['sources-crud.feature', 'connection-testing.feature', 'sync-operations.feature', 'source-types.feature', 'role-based-access.feature'],
      totalScenarios: 104,
      passed: 0,
      failed: 4,
      skipped: 100,
      status: 'unhealthy'
    },
    {
      domain: 'Transformation',
      icon: '⟐',
      accentVar: '--accent-transform',
      subtleVar: '--accent-transform-subtle',
      featureFiles: ['pipelines-crud.feature', 'steps-management.feature', 'pipeline-execution.feature', 'role-based-access.feature'],
      totalScenarios: 98,
      passed: 0,
      failed: 3,
      skipped: 95,
      status: 'unhealthy'
    },
    {
      domain: 'Reporting',
      icon: '◨',
      accentVar: '--accent-reporting',
      subtleVar: '--accent-reporting-subtle',
      featureFiles: ['dashboards-crud.feature', 'widgets-crud.feature', 'widgets.feature', 'queries-crud.feature', 'date-filters.feature', 'role-based-access.feature'],
      totalScenarios: 211,
      passed: 0,
      failed: 4,
      skipped: 207,
      status: 'unhealthy'
    },
    {
      domain: 'Export',
      icon: '↗',
      accentVar: '--accent-export',
      subtleVar: '--accent-export-subtle',
      featureFiles: ['jobs-crud.feature', 'job-execution.feature', 'job-formats.feature', 'role-based-access.feature'],
      totalScenarios: 125,
      passed: 0,
      failed: 3,
      skipped: 122,
      status: 'unhealthy'
    },
    {
      domain: 'Users',
      icon: '◉',
      accentVar: '--accent-users',
      subtleVar: '--accent-users-subtle',
      featureFiles: ['users-crud.feature', 'companies-crud.feature', 'role-based-access.feature', 'audit-log.feature'],
      totalScenarios: 110,
      passed: 0,
      failed: 4,
      skipped: 106,
      status: 'unhealthy'
    },
    {
      domain: 'Portal',
      icon: '⬡',
      accentVar: '--accent-dashboard',
      subtleVar: '--accent-dashboard-subtle',
      featureFiles: ['health-monitoring.feature', 'feature-navigation.feature', 'cross-domain-workflows.feature'],
      totalScenarios: 73,
      passed: 0,
      failed: 3,
      skipped: 70,
      status: 'unhealthy'
    }
  ]);

  protected readonly topRowDomains = computed(() => this.domainResults().slice(0, 4));
  protected readonly bottomRowDomains = computed(() => this.domainResults().slice(4, 7));

  protected readonly overallStatus = computed(() => {
    const results = this.domainResults();
    const allPending = results.every(r => r.status === 'inactive');
    if (allPending) return 'inactive';

    const anyFailed = results.some(r => r.status === 'unhealthy');
    if (anyFailed) return 'unhealthy';

    const anyDegraded = results.some(r => r.status === 'degraded');
    if (anyDegraded) return 'degraded';

    return 'healthy';
  });

  protected readonly passRate = computed(() => {
    const s = this.summary();
    if (s.passed + s.failed === 0) return 0;
    return Math.round((s.passed / (s.passed + s.failed)) * 100);
  });

  protected readonly coverageCategories = [
    { name: 'CRUD Operations', tag: '@crud', count: 245 },
    { name: 'Role-Based Access', tag: '@rbac', count: 89 },
    { name: 'Validation', tag: '@validation', count: 67 },
    { name: 'Smoke Tests', tag: '@smoke', count: 23, executed: true },
    { name: 'API Tests', tag: '@api', count: 45 },
    { name: 'UI States', tag: '@ui', count: 52 },
    { name: 'Error Handling', tag: '@error', count: 38 },
    { name: 'Edge Cases', tag: '@edge', count: 24 }
  ];

  protected readonly testStatus = signal({
    infrastructure: 'ready',
    stepDefinitions: 189,
    missingSteps: 1391,
    smokeTestsGenerated: 23,
    smokeTestsRun: 23,
    failureReason: 'Element timeouts - Angular Material components need selector updates'
  });

  protected getStatusText(status: string): string {
    switch (status) {
      case 'healthy': return 'Passing';
      case 'degraded': return 'Partial';
      case 'unhealthy': return 'Failing';
      case 'inactive': return 'Pending';
      default: return 'Unknown';
    }
  }

  protected getDomainPassRate(domain: DomainTestResult): number {
    if (domain.passed + domain.failed === 0) return 0;
    return Math.round((domain.passed / (domain.passed + domain.failed)) * 100);
  }
}
