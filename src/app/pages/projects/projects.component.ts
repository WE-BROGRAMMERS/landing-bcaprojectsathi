import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { SharedService } from '../../services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, FormsModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedPriceRange: string = '';
  selectedComplexity: string = '';
  selectedSemester: string = '';
  currentView: string = 'masonry';
  sortBy: string = 'newest';

  projects: Project[] = [];

  Math: any;

  brandInfo: Signal<any | null>;

  constructor(
    private projectService: ProjectService, 
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private seoService: SeoService
  ) {
    this.brandInfo = this.sharedService.getBrandInfo();
  }

  ngOnInit(): void {
    // Set SEO meta tags for projects page
    this.seoService.updateMetaTags({
      title: 'BCA Semester Projects - Download Source Code & Documentation',
      description: 'Browse 50+ BCA semester projects with complete source code and documentation. Web development, game development, management systems, and more. Perfect for 4th, 6th, and 8th semester students.',
      keywords: 'BCA projects download, semester projects source code, web development projects, PHP MySQL projects, Spring Boot projects, project documentation, BCA 6th semester projects',
      url: 'https://bcaprojectsathi.com/projects',
      image: 'https://bcaprojectsathi.com/assets/images/projects/chess-bot-project-cover.png',
      type: 'website'
    });

    // Generate ItemList Structured Data for Projects
    this.projectService.getProjects().subscribe(data => {
      this.projects = data;
      this.generateProjectsStructuredData();
    });

    // Handle query parameters from hero search
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchTerm = params['search'];
      }
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      if (params['price']) {
        this.selectedPriceRange = this.mapPriceRange(params['price']);
      }
      if (params['semester']) {
        this.selectedSemester = params['semester'];
      }
    });
  }

  private generateProjectsStructuredData() {
    const projectListData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "BCA Semester Projects",
      "description": "Complete collection of BCA semester projects with source code and documentation",
      "numberOfItems": this.projects.length,
      "itemListElement": this.projects.map((project, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SoftwareApplication",
          "name": project.title,
          "description": project.description,
          "applicationCategory": "Educational Software",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": project.price.replace('NPR ', ''),
            "priceCurrency": "NPR",
            "availability": "https://schema.org/InStock"
          },
          "author": {
            "@type": "Organization",
            "name": "BCAProjectSathi"
          }
        }
      }))
    };

    this.seoService.generateStructuredData('projects', projectListData);
  }

  get filteredProjects(): Project[] {
    let filtered = [...this.projects];

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (this.selectedCategory && this.selectedCategory !== 'Any Type') {
      filtered = filtered.filter(project => project.category === this.selectedCategory);
    }

    // Filter by price range
    if (this.selectedPriceRange && this.selectedPriceRange !== 'Any Price') {
      filtered = filtered.filter(project => this.filterByPrice(project, this.selectedPriceRange));
    }

    // Filter by complexity
    if (this.selectedComplexity && this.selectedComplexity !== 'Any') {
      filtered = filtered.filter(project => project.complexity === this.selectedComplexity);
    }

    // Filter by semester
    if (this.selectedSemester && this.selectedSemester !== 'Any') {
      filtered = filtered.filter(project => project.semester === this.selectedSemester);
    }

    // Sort projects
    filtered = this.sortProjects(filtered);

    return filtered;
  }

  private filterByPrice(project: Project, priceRange: string): boolean {
    const price = parseInt(project.price.replace('NPR ', '').replace(',', ''));
    switch (priceRange) {
      case 'NPR 0 - NPR 5k': return price <= 5000;
      case 'NPR 5k - NPR 8k': return price > 5000 && price <= 8000;
      case 'NPR 8k+': return price > 8000;
      default: return true;
    }
  }

  private sortProjects(projects: Project[]): Project[] {
    switch (this.sortBy) {
      case 'price-low':
        return projects.sort((a, b) => this.getPrice(a) - this.getPrice(b));
      case 'price-high':
        return projects.sort((a, b) => this.getPrice(b) - this.getPrice(a));
      case 'name':
        return projects.sort((a, b) => a.title.localeCompare(b.title));
      case 'newest':
      default:
        return projects; // Keep original order for newest
    }
  }

  private getPrice(project: Project): number {
    return parseInt(project.price.replace('NPR ', '').replace(',', ''));
  }

  onSearch(): void {
    // Search is reactive through getter
  }

  toggleView(view: string): void {
    this.currentView = view;
  }

  onSortChange(): void {
    // Sort is reactive through getter
  }

  selectComplexity(complexity: string): void {
    this.selectedComplexity = complexity;
  }

  private mapPriceRange(range: string): string {
    // Map hero search price ranges to projects page ranges
    switch (range) {
      case '0-5000': return 'NPR 0 - NPR 5k';
      case '5000-8000': return 'NPR 5k - NPR 8k';
      case '8000-10000':
      case '10000-15000':
      case '15000+': return 'NPR 8k+';
      default: return '';
    }
  }
}