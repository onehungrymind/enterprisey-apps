import { Component } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'proto-home',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCard,
    NgForOf,
    MatButton
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  items = [
    {
      title: 'item title 1',
      id: 1,
    },
    {
      title: 'item title 2',
      id: 2,
    },
    {
      title: 'item title 3',
      id: 3,
    },
    {
      title: 'item title 4',
      id: 4,
    },
    {
      title: 'item title 5',
      id: 5,
    },
  ]
}
