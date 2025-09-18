import { Component, Signal } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  headerData: Signal<any|null>;

  constructor(private sharedService: SharedService) {
    this.headerData = this.sharedService.getBrandInfo();
  }

  mobileNavActive = false;

  toggleMobileNav() {
    this.mobileNavActive = !this.mobileNavActive;
  }

  closeMobileNav() {
    this.mobileNavActive = false;
  }

}
