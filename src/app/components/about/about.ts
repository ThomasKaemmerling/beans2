import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { LocalizationService } from '../../services/localization';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class AboutComponent {
  constructor(public localization: LocalizationService) {}
}
