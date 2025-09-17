import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent implements OnInit {
  currentPage: string = '';
  pageName: string = '';

  constructor(private router: Router){}

  ngOnInit(): void {
    const currentUrl = this.router.url;
    this.pageName = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
    this.currentPage = this.pageName.charAt(0).toUpperCase() + this.pageName.slice(1);
  }
}
