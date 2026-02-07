import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService, ThemeToggleComponent, StatusDotComponent } from '@proto/ui-theme';

@Component({
  imports: [RouterModule, ThemeToggleComponent, StatusDotComponent],
  selector: 'proto-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  protected readonly themeService = inject(ThemeService);
  protected readonly currentTime = signal(new Date());

  private timeInterval?: ReturnType<typeof setInterval>;

  ngOnInit() {
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
}
