import { Component, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from "./shared/header/header.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = 'landing-bcaprojectsathi';

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngAfterViewInit(): void {

    // Toggle .scrolled class on body
    const header = this.document.querySelector('#header');
    const body = this.document.body;
    const toggleScrolled = () => {
      if (!header) return;
      if (
        !header.classList.contains('scroll-up-sticky') &&
        !header.classList.contains('sticky-top') &&
        !header.classList.contains('fixed-top')
      ) return;
      if (window.scrollY > 100) {
        this.renderer.addClass(body, 'scrolled');
      } else {
        this.renderer.removeClass(body, 'scrolled');
      }
    };
    this.renderer.listen('window', 'scroll', toggleScrolled);
    this.renderer.listen('window', 'load', toggleScrolled);

    // Mobile nav toggle
    const mobileNavToggleBtn = this.document.querySelector('.mobile-nav-toggle');
    const mobileNavToggle = () => {
      if (body.classList.contains('mobile-nav-active')) {
        this.renderer.removeClass(body, 'mobile-nav-active');
      } else {
        this.renderer.addClass(body, 'mobile-nav-active');
      }
      if (mobileNavToggleBtn) {
        mobileNavToggleBtn.classList.toggle('bi-list');
        mobileNavToggleBtn.classList.toggle('bi-x');
      }
    };
    if (mobileNavToggleBtn) {
      this.renderer.listen(mobileNavToggleBtn, 'click', mobileNavToggle);
    }

    // Hide mobile nav on navmenu link click
    this.document.querySelectorAll('#navmenu a').forEach(navmenu => {
      this.renderer.listen(navmenu, 'click', () => {
        if (body.classList.contains('mobile-nav-active')) {
          mobileNavToggle();
        }
      });
    });

    // Toggle mobile nav dropdowns
    this.document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
      this.renderer.listen(navmenu, 'click', function (this: HTMLElement, e: Event) {
        e.preventDefault();
        const parent = this.parentNode as HTMLElement;
        if (parent) {
          parent.classList.toggle('active');
          if (parent.nextElementSibling) {
            parent.nextElementSibling.classList.toggle('dropdown-active');
          }
        }
        e.stopImmediatePropagation();
      });
    });

    // Preloader
    const preloader = this.document.querySelector('#preloader');
    if (preloader) {
      this.renderer.listen('window', 'load', () => {
        preloader.remove();
      });
    }

    // Scroll top button
    const scrollTop = this.document.querySelector('.scroll-top');
    const toggleScrollTop = () => {
      if (scrollTop) {
        if (window.scrollY > 100) {
          scrollTop.classList.add('active');
        } else {
          scrollTop.classList.remove('active');
        }
      }
    };
    if (scrollTop) {
      this.renderer.listen(scrollTop, 'click', (e: Event) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    this.renderer.listen('window', 'scroll', toggleScrollTop);
    this.renderer.listen('window', 'load', toggleScrollTop);

    // Animation on scroll (AOS)
    this.renderer.listen('window', 'load', () => {
      if ((window as any).AOS) {
        (window as any).AOS.init({
          duration: 600,
          easing: 'ease-in-out',
          once: true,
          mirror: false
        });
      }
    });

    // PureCounter
    this.renderer.listen('window', 'load', () => {
      if ((window as any).PureCounter) {
        new (window as any).PureCounter();
      }
    });

    // Swiper sliders
    this.renderer.listen('window', 'load', () => {
      if (!(window as any).Swiper) return;
      this.document.querySelectorAll('.init-swiper').forEach(swiperElement => {
        const configElement = swiperElement.querySelector('.swiper-config');
        if (!configElement) return;
        let config = {};
        try {
          config = JSON.parse(configElement.innerHTML.trim());
        } catch (e) {
          console.error('Invalid Swiper config JSON', e);
        }
        if (swiperElement.classList.contains('swiper-tab')) {
          if (typeof (window as any).initSwiperWithCustomPagination === 'function') {
            (window as any).initSwiperWithCustomPagination(swiperElement, config);
          }
        } else {
          new (window as any).Swiper(swiperElement, config);
        }
      });
    });
  }
}