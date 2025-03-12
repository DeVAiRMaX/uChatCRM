import { Component } from '@angular/core';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

}
