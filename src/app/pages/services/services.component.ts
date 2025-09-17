import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: 'Our Services - BCA Project Development & Academic Support',
      description: 'BCAProjectSathi offers comprehensive services: web development projects, documentation, .np domain hosting, API integration, Spring Boot development, and BCA study materials for semester projects.',
      keywords: 'BCA services, web development, project documentation, .np domain hosting, API integration, Spring Boot, PostgreSQL, study materials, academic support',
      url: 'https://bcaprojectsathi.com/services',
      image: 'https://bcaprojectsathi.com/assets/images/tech-background.png',
      type: 'website'
    });

    // Generate Services Structured Data
    const servicesData = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "BCA Project Development Services",
      "description": "Comprehensive BCA semester project development, documentation, and academic support services",
      "provider": {
        "@type": "Organization",
        "name": "BCAProjectSathi"
      },
      "serviceType": "Educational Technology Services",
      "areaServed": "Nepal",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "BCA Project Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": ".np Domain + Portfolio Hosting",
              "description": "Free .np domain registration and portfolio deployment with SEO optimization"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Web Development",
              "description": "PHP + MySQL, HTML, CSS, JavaScript, Bootstrap development with responsive design"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Spring Boot & PostgreSQL",
              "description": "Advanced backend solutions with REST API development and database optimization"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "BCA Study Materials",
              "description": "Free syllabus-based notes, semester resources, and past year questions"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "API Integration",
              "description": "eSewa & Khalti payment gateway integration with RESTful API setup"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Project Documentation",
              "description": "Academic-standard documentation with proper formatting and structure"
            }
          }
        ]
      }
    };

    this.seoService.generateStructuredData('services', servicesData);
  }
}