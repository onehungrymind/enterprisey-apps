import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'ui-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="avatar"
      [style.width.px]="size()"
      [style.height.px]="size()"
      [style.border-radius.px]="size() * 0.28"
      [style.font-size.px]="size() * 0.36"
      [style.--avatar-color]="color()"
    >
      {{ initials() }}
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .avatar {
      background: color-mix(in srgb, var(--avatar-color) 10%, transparent);
      border: 1.5px solid color-mix(in srgb, var(--avatar-color) 20%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: var(--avatar-color);
      flex-shrink: 0;
      text-transform: uppercase;
    }
  `]
})
export class AvatarComponent {
  readonly firstName = input.required<string>();
  readonly lastName = input.required<string>();
  readonly color = input('#94a3b8');
  readonly size = input(36);

  protected readonly initials = computed(() =>
    `${this.firstName().charAt(0)}${this.lastName().charAt(0)}`
  );
}
