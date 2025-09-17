import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private dataUrl = 'assets/data';

  constructor(private http: HttpClient) { }

  getProjects() {
    return this.http.get<Project[]>(`${this.dataUrl}/project-overall-description.json`);
  }

  getProjectById(id: string) {
    return this.http.get<Project[]>(`${this.dataUrl}/project-overall-description.json`).pipe(
      map((projects: Project[]) => projects.find(project => project.id === id))
    );
  }

  getProjectDetails(id: string) {
    return this.http.get<Project[]>(`${this.dataUrl}/project-detail-description.json`).pipe(
      map((projects: Project[]) => projects.find(project => project.id === id))
    );
  }
}
