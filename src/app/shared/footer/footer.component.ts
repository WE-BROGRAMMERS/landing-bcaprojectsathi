import { Component, Signal } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  footerData: Signal<any|null>;

  constructor(private sharedService: SharedService) {
    this.footerData = this.sharedService.getBrandInfo();
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

}