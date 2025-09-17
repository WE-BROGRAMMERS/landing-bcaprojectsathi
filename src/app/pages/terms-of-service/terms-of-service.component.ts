import { Component, Signal } from '@angular/core';
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule],
  templateUrl: './terms-of-service.component.html',
  styleUrl: './terms-of-service.component.scss'
})
export class TermsOfServiceComponent {

  brandInfo: Signal<any | null>;

  constructor(private sharedService: SharedService) {
    this.brandInfo = this.sharedService.getBrandInfo();
  }

}
