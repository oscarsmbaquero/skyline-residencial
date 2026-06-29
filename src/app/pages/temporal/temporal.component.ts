import { Component } from '@angular/core';

@Component({
  selector: 'app-temporal',
  imports: [],
  templateUrl: './temporal.component.html',
  styleUrl: './temporal.component.css'
})
export class TemporalComponent {
  currentYear = new Date().getFullYear();

}
