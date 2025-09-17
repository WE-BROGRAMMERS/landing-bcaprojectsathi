import { Component, Signal } from '@angular/core';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {

  brandInfo: Signal<any | null>;
  
    constructor(private sharedService: SharedService) {
      this.brandInfo = this.sharedService.getBrandInfo();
    }

}
