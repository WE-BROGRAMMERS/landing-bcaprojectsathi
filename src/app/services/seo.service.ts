import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  
  private defaultMeta = {
    title: 'BCAProjectSathi - Your Go-To Partner for BCA Project Excellence',
    description: 'BCAProjectSathi is your trusted partner for BCA semester projects. With 5+ years of experience, we provide web development assistance, documentation, study materials, and academic support for BCA students in Nepal.',
    keywords: 'BCA projects, semester projects Nepal, web development assistance, project documentation, BCA study materials, programming help, academic support Nepal',
    image: 'https://bcaprojectsathi.com/assets/icons/bcaprojectsathi-logo.png',
    url: 'https://bcaprojectsathi.com',
    siteName: 'BCAProjectSathi',
    type: 'website',
    locale: 'en_US'
  };

  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeRouterEvents();
  }

  private initializeRouterEvents() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateCanonicalUrl(event.url);
      });
  }

  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  updateMetaTags(config: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  }) {
    // Update title
    if (config.title) {
      this.updateTitle(config.title);
    }

    // Update basic meta tags
    this.updateTag('description', config.description || this.defaultMeta.description);
    this.updateTag('keywords', config.keywords || this.defaultMeta.keywords);
    this.updateTag('author', config.author || 'BCAProjectSathi Team');

    // Update Open Graph tags
    this.updateProperty('og:title', config.title || this.defaultMeta.title);
    this.updateProperty('og:description', config.description || this.defaultMeta.description);
    this.updateProperty('og:image', config.image || this.defaultMeta.image);
    this.updateProperty('og:url', config.url || this.defaultMeta.url);
    this.updateProperty('og:type', config.type || this.defaultMeta.type);
    this.updateProperty('og:site_name', this.defaultMeta.siteName);
    this.updateProperty('og:locale', this.defaultMeta.locale);

    // Update Twitter Card tags
    this.updateName('twitter:card', 'summary_large_image');
    this.updateName('twitter:title', config.title || this.defaultMeta.title);
    this.updateName('twitter:description', config.description || this.defaultMeta.description);
    this.updateName('twitter:image', config.image || this.defaultMeta.image);
    this.updateName('twitter:site', '@bcaprojectsathi');
    this.updateName('twitter:creator', '@bcaprojectsathi');

    // Update article specific tags
    if (config.type === 'article') {
      if (config.author) this.updateProperty('article:author', config.author);
      if (config.publishedTime) this.updateProperty('article:published_time', config.publishedTime);
      if (config.modifiedTime) this.updateProperty('article:modified_time', config.modifiedTime);
      if (config.section) this.updateProperty('article:section', config.section);
      if (config.tags) {
        config.tags.forEach(tag => {
          this.updateProperty('article:tag', tag);
        });
      }
    }

    // Update robots meta
    this.updateName('robots', 'index,follow');
    this.updateName('googlebot', 'index,follow');

    // Update mobile meta
    this.updateName('viewport', 'width=device-width, initial-scale=1');
    this.updateName('format-detection', 'telephone=no');
  }

  private updateTag(name: string, content: string) {
    this.meta.updateTag({ name, content });
  }

  private updateProperty(property: string, content: string) {
    this.meta.updateTag({ property, content });
  }

  private updateName(name: string, content: string) {
    this.meta.updateTag({ name, content });
  }

  private updateCanonicalUrl(url: string) {
    if (isPlatformBrowser(this.platformId)) {
      const baseUrl = 'https://bcaprojectsathi.com';
      const canonicalUrl = baseUrl + url;
      
      let link: HTMLLinkElement = document.querySelector("link[rel='canonical']") || document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', canonicalUrl);
      
      if (!document.querySelector("link[rel='canonical']")) {
        document.head.appendChild(link);
      }
    }
  }

  generateStructuredData(type: string, data: any) {
    if (isPlatformBrowser(this.platformId)) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(data);
      script.id = `structured-data-${type}`;
      
      // Remove existing structured data of the same type
      const existing = document.getElementById(`structured-data-${type}`);
      if (existing) {
        existing.remove();
      }
      
      document.head.appendChild(script);
    }
  }

  createOrganizationStructuredData() {
    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "BCAProjectSathi",
      "alternateName": "BCA Project Sathi",
      "url": "https://bcaprojectsathi.com",
      "logo": "https://bcaprojectsathi.com/assets/icons/bcaprojectsathi-logo.png",
      "description": "BCAProjectSathi is your trusted partner for BCA semester projects. With 5+ years of experience, we provide web development assistance, documentation, and study materials for BCA students in Nepal.",
      "foundingDate": "2019",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+977-9869550743",
        "contactType": "Customer Service",
        "availableLanguage": ["English", "Nepali"]
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "Nepal"
      },
      "sameAs": [
        "https://facebook.com/bcaprojectsathi",
        "https://instagram.com/bcaprojectsathi"
      ],
      "areaServed": "Nepal",
      "knowsAbout": [
        "BCA Projects",
        "Web Development",
        "Academic Support",
        "Programming Education",
        "Project Documentation"
      ]
    };

    this.generateStructuredData('organization', organizationData);
  }

  createWebsiteStructuredData() {
    const websiteData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "BCAProjectSathi",
      "url": "https://bcaprojectsathi.com",
      "description": "Your trusted partner for BCA semester projects and academic success",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://bcaprojectsathi.com/projects?search={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "author": {
        "@type": "Organization",
        "name": "BCAProjectSathi"
      }
    };

    this.generateStructuredData('website', websiteData);
  }

  createServiceStructuredData() {
    const serviceData = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "BCA Project Development Services",
      "description": "Professional BCA semester project development, documentation, and academic support services",
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
              "name": "Web Development Projects",
              "description": "Custom web development projects for BCA students"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Project Documentation",
              "description": "Professional academic documentation services"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Study Materials",
              "description": "BCA syllabus-based notes and resources"
            }
          }
        ]
      }
    };

    this.generateStructuredData('service', serviceData);
  }
}