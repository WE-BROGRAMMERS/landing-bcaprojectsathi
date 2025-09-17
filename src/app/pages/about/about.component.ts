import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: 'About BCAProjectSathi - 5+ Years of BCA Project Excellence',
      description: 'Learn about BCAProjectSathi - your trusted partner for BCA semester projects since 2019. With 5+ years of experience, we have helped 100+ students with web development projects, documentation, and academic support.',
      keywords: 'about BCAProjectSathi, BCA project assistance, web development mentoring, academic support Nepal, programming education, project documentation services',
      url: 'https://bcaprojectsathi.com/about',
      image: 'https://bcaprojectsathi.com/assets/images/team.jpg',
      type: 'website'
    });

    // Generate About Page Structured Data
    const aboutPageData = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About BCAProjectSathi",
      "description": "Learn about BCAProjectSathi - your trusted partner for BCA semester projects since 2019",
      "url": "https://bcaprojectsathi.com/about",
      "mainEntity": {
        "@type": "Organization",
        "name": "BCAProjectSathi",
        "description": "BCAProjectSathi is your trusted partner for BCA semester projects. With over 5 years of experience, we specialize in providing personalized web development project assistance tailored to the unique needs of BCA students.",
        "foundingDate": "2019",
        "numberOfEmployees": "5-10",
        "areaServed": "Nepal"
      }
    };

    this.seoService.generateStructuredData('about', aboutPageData);
  }
}