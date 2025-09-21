import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { LocalizationService } from '../../services/localization';

@Component({
  selector: 'app-developer',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './developer.html',
  styleUrl: './developer.scss'
})
export class DeveloperComponent {
  constructor(public localization: LocalizationService) {}
}
