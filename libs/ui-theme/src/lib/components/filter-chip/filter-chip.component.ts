import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'ui-filter-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="chip"
      [class.active]="active()"
      (click)="clicked.emit()"
    >
      <ng-content />
    </button>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .chip {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      font-family: 'DM Sans', sans-serif;
      background: var(--bg-surface-hover);
      border: 1px solid transparent;
      color: var(--text-quaternary);
    }

    .chip:hover {
      filter: brightness(1.1);
    }

    .chip.active {
      background: var(--accent-subtle);
      border-color: var(--border-strong);
      color: var(--accent);
    }
  `]
})
export class FilterChipComponent {
  readonly active = input(false);
  readonly clicked = output<void>();
}
