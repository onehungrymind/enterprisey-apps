import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthFacade } from '@proto/auth-state';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'proto-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent {
  private readonly authFacade = inject(AuthFacade);

  email = signal('');
  password = signal('');
  showPassword = signal(false);

  loading = toSignal(this.authFacade.loading$, { initialValue: false });
  error = toSignal(this.authFacade.error$, { initialValue: null });

  onSubmit() {
    const emailVal = this.email();
    const passwordVal = this.password();
    if (emailVal && passwordVal) {
      this.authFacade.login(emailVal, passwordVal);
    }
  }

  togglePasswordVisibility() {
    this.showPassword.update((v) => !v);
  }
}
