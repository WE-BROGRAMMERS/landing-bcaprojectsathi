import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { SharedService } from '../../services/shared.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  heroProject: Project | undefined;
  featuredProperty: Project | undefined;
  sidebarProperties: Project[] = [];
  brandData: Signal<any|null>;

  // Search form properties
  searchForm = {
    title: '',
    type: '',
    priceRange: '',
    semester: ''
  };

  // Categories for search
  projectTypes = [
    { value: '', label: 'All Types' },
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Game Development', label: 'Game Development' },
    { value: 'Management System', label: 'Management System' },
    { value: 'Data Management', label: 'Data Management' },
    { value: 'Mobile App Development', label: 'Mobile App Development' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Artificial Intelligence', label: 'Artificial Intelligence' }
  ];

  priceRanges = [
    { value: '', label: 'Any Price' },
    { value: '0-5000', label: 'Up to NPR 5,000' },
    { value: '5000-8000', label: 'NPR 5,000 - NPR 8,000' },
    { value: '8000-10000', label: 'NPR 8,000 - NPR 10,000' },
    { value: '10000-15000', label: 'NPR 10,000 - NPR 15,000' },
    { value: '15000+', label: 'Above NPR 15,000' }
  ];

  semesters = [
    { value: '', label: 'Any Semester' },
    { value: '4th', label: '4th Semester' },
    { value: '5th', label: '5th Semester' },
    { value: '6th', label: '6th Semester' },
    { value: '8th', label: '8th Semester' }
  ];
  
  constructor(
    private sharedService: SharedService, 
    private projectService: ProjectService,
    private router: Router,
    private seoService: SeoService
  ) {
    this.brandData = this.sharedService.getBrandInfo();
  }

  ngOnInit(): void {
    // Set SEO meta tags for home page
    this.seoService.updateMetaTags({
      title: 'BCAProjectSathi - Your Go-To Partner for BCA Project Excellence',
      description: 'BCAProjectSathi is your trusted partner for BCA semester projects. With 5+ years of experience, we provide web development assistance, documentation, study materials, and academic support for BCA students in Nepal.',
      keywords: 'BCA projects Nepal, semester projects, web development assistance, project documentation, BCA study materials, programming help, academic support, PHP MySQL projects, Spring Boot projects, TU BCA',
      url: 'https://bcaprojectsathi.com',
      image: 'https://bcaprojectsathi.com/assets/icons/bcaprojectsathi-logo.png',
      type: 'website'
    });

    // Generate structured data
    this.seoService.createOrganizationStructuredData();
    this.seoService.createWebsiteStructuredData();
    this.seoService.createServiceStructuredData();

    this.projectService.getProjects().subscribe(data => {
      this.featuredProperty = data[0];
      this.sidebarProperties = data.slice(1, 3);
    });

    this.projectService.getProjectById('uchess-bot').subscribe(data => {
      this.heroProject = data;
    });
  }

  onSearchSubmit(): void {
    // Build query parameters based on form values
    const queryParams: any = {};
    
    if (this.searchForm.title.trim()) {
      queryParams.search = this.searchForm.title.trim();
    }
    
    if (this.searchForm.type) {
      queryParams.category = this.searchForm.type;
    }
    
    if (this.searchForm.priceRange) {
      queryParams.price = this.searchForm.priceRange;
    }
    
    if (this.searchForm.semester) {
      queryParams.semester = this.searchForm.semester;
    }

    // Navigate to projects page with search parameters
    this.router.navigate(['/projects'], { queryParams });
  }

  // Quick search functions
  searchByCategory(category: string): void {
    this.router.navigate(['/projects'], { 
      queryParams: { category } 
    });
  }

  searchBySemester(semester: string): void {
    this.router.navigate(['/projects'], { 
      queryParams: { semester } 
    });
  }

  // Reset search form
  resetSearch(): void {
    this.searchForm = {
      title: '',
      type: '',
      priceRange: '',
      semester: ''
    };
  }
}