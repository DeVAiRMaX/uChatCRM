import { Component } from '@angular/core';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {

}
