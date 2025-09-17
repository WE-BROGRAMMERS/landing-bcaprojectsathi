import { HttpClient } from '@angular/common/http';
import { Injectable, signal, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private brandInfo = signal<any | null>(null);
  private loaded = false; // prevent duplicate API calls

  constructor(private http: HttpClient) {}

  getBrandInfo(): Signal<any | null> {
    if (!this.loaded) {
      this.loaded = true;
      this.http.get<any>('assets/data/bcaprojectsathi.json')
        .subscribe(data => this.brandInfo.set(data));
    }
    return this.brandInfo;
  }

  refreshBrandInfo() {
    this.http.get<any>('assets/data/bcaprojectsathi.json')
      .subscribe(data => this.brandInfo.set(data));
  }
}
