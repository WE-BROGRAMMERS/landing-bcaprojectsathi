import { Component, Signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit {
  headerData: Signal<any|null>;
  @ViewChild('navmenu') navmenu!: ElementRef;
  @ViewChild('mobileNavToggle') mobileNavToggle!: ElementRef;

  constructor(private sharedService: SharedService) {
    this.headerData = this.sharedService.getBrandInfo();
  }

  ngAfterViewInit() {
    this.initMobileNav();
  }

  private initMobileNav() {
    const toggle = this.mobileNavToggle?.nativeElement;
    const navmenu = this.navmenu?.nativeElement;

    if (toggle && navmenu) {
      toggle.addEventListener('click', () => {
        navmenu.classList.toggle('mobile-nav-active');
        toggle.classList.toggle('bi-list');
        toggle.classList.toggle('bi-x');
      });

      // Close mobile nav when clicking on nav links
      const navLinks = navmenu.querySelectorAll('a');
      navLinks.forEach((link: HTMLElement) => {
        link.addEventListener('click', () => {
          if (navmenu.classList.contains('mobile-nav-active')) {
            navmenu.classList.remove('mobile-nav-active');
            toggle.classList.add('bi-list');
            toggle.classList.remove('bi-x');
          }
        });
      });
    }
  }
}