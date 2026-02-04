
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { User } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
    selector: 'proto-users-list',
    imports: [MaterialModule],
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent {
  @Input() users: User[] = [];
  @Input() readonly = false;
  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();
}
