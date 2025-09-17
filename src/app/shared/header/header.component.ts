import { Component, Signal } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  headerData: Signal<any|null>;

  constructor(private sharedService: SharedService) {
    this.headerData = this.sharedService.getBrandInfo();
  }

}
