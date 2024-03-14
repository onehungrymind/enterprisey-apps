import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';
import { UsersFacade } from '@proto/users-state';
import { Observable, filter } from 'rxjs';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UsersListComponent } from './users-list/users-list.component';

import { LoginModule } from '@proto/ui-login';

@Component({
  selector: 'proto-users',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    UsersListComponent,
    UserDetailsComponent
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]> = this.usersFacade.allUsers$;
  selectedUser$: Observable<User> = this.usersFacade.selectedUser$.pipe(
    filter((user): user is User => user !== undefined && user !== '')
  );

  constructor(private usersFacade: UsersFacade) {}

  ngOnInit(): void {
    this.reset();
  }

  reset() {
    this.loadUsers();
    this.usersFacade.resetSelectedUser();
  }

  selectUser(user: User) {
    this.usersFacade.selectUser(user.id as string);
  }

  loadUsers() {
    this.usersFacade.loadUsers();
  }

  saveUser(user: User) {
    this.usersFacade.saveUser(user);
  }

  deleteUser(user: User) {
    this.usersFacade.deleteUser(user);
  }
}
