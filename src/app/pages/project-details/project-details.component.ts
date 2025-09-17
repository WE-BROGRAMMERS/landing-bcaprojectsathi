import { Component, AfterViewInit, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';
import { SeoService } from '../../services/seo.service';

declare var Swiper: any;

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, PdfViewerModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements AfterViewInit {
  @ViewChild('pdfViewer') pdfViewer!: PdfViewerComponent;
  @ViewChild('pdfWrapper') pdfWrapper!: any;
  private gallerySwiper: any;
  private thumbsSwiper: any;

  project: any;
  pdfSrc: string = '';

  // PDF viewer properties
  isLoading = true;
  error: any;
  page: number = 1;
  totalPages: number = 0;
  isLoaded = false;
  fitToPage = true;
  zoomScale = 1.0; // Changed to number for zoom control
  zoom: number = 1.0;

  tableOfContents: any[] = [];
  flattenedToc: any[] = []; // Flattened list for display

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private projectService: ProjectService,
    private router: Router,
    private seoService: SeoService
  ) { }

  ngOnInit(): void {
    const urlSegments = this.router.url.split('/');
    const projectId = urlSegments.length > 2 ? urlSegments[2] : null;
    if (projectId) {
      this.getProjectDetailById(projectId);
    }
  }

  getProjectDetailById(projectId: string) {
    this.projectService.getProjectDetails(projectId).subscribe(data => {
      if (data) {
        this.project = data;

        // Update SEO for specific project
        this.seoService.updateMetaTags({
          title: `${data.title} - BCA Project with Source Code`,
          description: data.description + ' Download complete source code, documentation, and setup instructions.',
          keywords: `${data.title}, ${data.category}, BCA project, source code, documentation, ${data.semester} semester`,
          url: `https://bcaprojectsathi.com${data.url}`,
          image: `https://bcaprojectsathi.com/${data.image}`,
          type: 'article',
          section: data.category,
          tags: [data.category, data.semester + ' Semester', data.complexity]
        });

        // Generate Product Structured Data
        this.generateProductStructuredData();

        // Set PDF source when project data is loaded
        if (this.project.documentationUrl) {
          this.pdfSrc = this.project.documentationUrl;
        }
      } else {
        this.router.navigate(['/404']);
      }
    });
  }

  private generateProductStructuredData() {
    const productData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": this.project.title,
      "description": this.project.description,
      "image": `https://bcaprojectsathi.com/${this.project.image}`,
      "brand": {
        "@type": "Brand",
        "name": "BCAProjectSathi"
      },
      "category": this.project.category,
      "offers": {
        "@type": "Offer",
        "price": this.project.price.replace('NPR ', ''),
        "priceCurrency": "NPR",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "BCAProjectSathi"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "25",
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    this.seoService.generateStructuredData('product', productData);
  }

  // PDF viewer event handlers
  afterLoadComplete(pdf: any) {
    this.isLoaded = true;
    this.isLoading = false;
    this.totalPages = pdf.numPages;

    // Extract and flatten Table of Contents
    pdf.getOutline().then((outline: any) => {
      console.log('PDF Outline:', outline); // Debug: Check if outline exists
      if (outline && outline.length > 0) {
        this.tableOfContents = outline;
        this.flattenedToc = this.flattenOutline(outline, 0);
      } else {
        console.warn('No outline found in PDF');
        this.tableOfContents = [];
        this.flattenedToc = [];
      }
    }).catch((err: any) => {
      console.error('Error extracting outline:', err);
      this.tableOfContents = [];
      this.flattenedToc = [];
    });
  }

  // Flatten nested outline to simple list with levels for styling
  private flattenOutline(items: any[], level: number = 0): any[] {
    const flat: any[] = [];
    for (const item of items) {
      flat.push({ title: item.title, dest: item.dest, level });
      if (item.items && item.items.length > 0) {
        flat.push(...this.flattenOutline(item.items, level + 1));
      }
    }
    return flat;
  }

  onPagesLoaded(event: any) {
    this.totalPages = event.numPages;
  }

  onError(error: any) {
    this.error = error;
    this.isLoading = false;
    console.error('PDF loading error:', error);
  }

  // Page navigation
  previousPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  // Zoom controls
  zoomIn() {
    this.zoomScale += 0.2;
    this.zoom = this.zoomScale;
  }

  zoomOut() {
    if (this.zoomScale > 0.2) {
      this.zoomScale -= 0.2;
      this.zoom = this.zoomScale;
    }
  }

  openFullScreen() {
    const elem = this.pdfWrapper?.nativeElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen();
    }
  }

  goToPage(dest: any) {
    if (dest && this.pdfViewer && this.pdfViewer.pdfLinkService) {
      this.pdfViewer.pdfLinkService.goToDestination(dest);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Your existing Swiper code...
      this.thumbsSwiper = new Swiper('.property-thumbnails-slider', {
        loop: true,
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
        breakpoints: {
          576: { slidesPerView: 5 },
          768: { slidesPerView: 6 }
        }
      });

      this.gallerySwiper = new Swiper('.property-gallery-slider', {
        loop: true,
        speed: 600,
        autoplay: {
          delay: 5000
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        thumbs: {
          swiper: this.thumbsSwiper
        }
      });
    }
  }

  downloadPdf() {
    if (this.pdfSrc) {
      const link = document.createElement('a');
      link.href = this.pdfSrc;
      link.download = this.project?.title ? `${this.project.title}-documentation.pdf` : 'documentation.pdf';
      link.click();
    }
  }
}