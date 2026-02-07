import { Component, OnInit, inject, signal, computed, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Feature } from '@proto/api-interfaces';
import { FeaturesFacade } from '@proto/features-state';
import { ThemeService, ThemeToggleComponent, StatusDotComponent } from '@proto/ui-theme';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthFacade } from '@proto/auth-state';

interface FeatureNav {
  id: string;
  name: string;
  slug: string;
  accentVar: string;
  subtleVar: string;
}

@Component({
  imports: [RouterModule, ThemeToggleComponent, StatusDotComponent],
  selector: 'proto-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly featuresFacade = inject(FeaturesFacade);
  private readonly authFacade = inject(AuthFacade);
  protected readonly themeService = inject(ThemeService);

  protected readonly features = toSignal(this.featuresFacade.allFeatures$, { initialValue: [] as Feature[] });
  protected readonly user = toSignal(this.authFacade.user$, { initialValue: null });
  protected readonly isAuthenticated = toSignal(this.authFacade.isAuthenticated$, { initialValue: false });
  protected readonly currentTime = signal(new Date());
  protected readonly allHealthy = signal(true);

  private timeInterval?: ReturnType<typeof setInterval>;

  protected readonly featureNavItems = computed<FeatureNav[]>(() => {
    const featureAccents: Record<string, { accent: string; subtle: string }> = {
      ingress: { accent: '--accent-ingress', subtle: '--accent-ingress-subtle' },
      transformation: { accent: '--accent-transform', subtle: '--accent-transform-subtle' },
      reporting: { accent: '--accent-reporting', subtle: '--accent-reporting-subtle' },
      export: { accent: '--accent-export', subtle: '--accent-export-subtle' },
      users: { accent: '--accent-users', subtle: '--accent-users-subtle' },
    };

    return this.features().map(f => ({
      id: f.slug,
      name: f.title,
      slug: f.slug,
      accentVar: featureAccents[f.slug]?.accent || '--accent-dashboard',
      subtleVar: featureAccents[f.slug]?.subtle || '--accent-dashboard-subtle',
    }));
  });

  ngOnInit() {
    this.featuresFacade.loadFeatures();
    this.timeInterval = setInterval(() => {
      this.currentTime.set(new Date());
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  protected formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour12: false });
  }

  protected logout() {
    this.authFacade.logout();
  }

  protected getUserInitials(): string {
    const u = this.user();
    if (!u) return '?';
    return `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`.toUpperCase() || '?';
  }
}
