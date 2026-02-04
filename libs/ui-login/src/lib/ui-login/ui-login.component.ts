import { Component } from '@angular/core';
import { Login } from '@proto/api-interfaces';
import { CommonModule } from '@angular/common';
import { UsersFacade } from '@proto/users-state';
import { MaterialModule } from '@proto/material';
import { FormsModule } from '@angular/forms';

export const filters = [
  'ig-xpro2',
  'ig-willow',
  'ig-walden',
  'ig-valencia',
  'ig-toaster',
  'ig-sutro',
  'ig-sierra',
  'ig-rise',
  'ig-nashville',
  'ig-mayfair',
  'ig-lofi',
  'ig-kelvin',
  'ig-inkwell',
  'ig-hudson',
  'ig-hefe',
  'ig-earlybird',
  'ig-brannan',
  'ig-amaro',
  'ig-1977',
];

@Component({
    selector: 'proto-ui-login',
    imports: [CommonModule, MaterialModule, FormsModule],
    templateUrl: './ui-login.component.html',
    styleUrls: ['./ui-login.component.scss']
})
export class LoginComponent {
  loginInfo: Login = {
    email: '',
    password: '',
  };

  chosenFilter = filters[Math.floor(Math.random() * filters.length)];

  constructor(private usersFacade: UsersFacade) {}

  login(loginInfo: Login) {
    this.usersFacade.login(loginInfo.email, loginInfo.password);
  }
}
