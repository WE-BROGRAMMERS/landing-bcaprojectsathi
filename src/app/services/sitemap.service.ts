import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SitemapService {

  generateSitemap(): string {
    const baseUrl = 'https://bcaprojectsathi.com';
    const today = new Date().toISOString().split('T')[0];

    const urls = [
      { loc: baseUrl, priority: '1.0', changefreq: 'weekly' },
      { loc: `${baseUrl}/about`, priority: '0.8', changefreq: 'monthly' },
      { loc: `${baseUrl}/services`, priority: '0.9', changefreq: 'monthly' },
      { loc: `${baseUrl}/projects`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${baseUrl}/contact`, priority: '0.7', changefreq: 'monthly' },
      { loc: `${baseUrl}/privacy-policy`, priority: '0.5', changefreq: 'yearly' },
      { loc: `${baseUrl}/terms-of-service`, priority: '0.5', changefreq: 'yearly' },
      // Add individual project URLs
      { loc: `${baseUrl}/projects/uchess-bot`, priority: '0.8', changefreq: 'monthly' },
      { loc: `${baseUrl}/projects/project-archival`, priority: '0.8', changefreq: 'monthly' },
      { loc: `${baseUrl}/projects/mazemaster-pathfinder-adventure-game`, priority: '0.8', changefreq: 'monthly' },
      { loc: `${baseUrl}/projects/exam-seat-management-system`, priority: '0.8', changefreq: 'monthly' }
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    urls.forEach(url => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${url.loc}</loc>\n`;
      sitemap += `    <lastmod>${today}</lastmod>\n`;
      sitemap += `    <changefreq>${url.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${url.priority}</priority>\n`;
      sitemap += `  </url>\n`;
    });

    sitemap += `</urlset>`;

    return sitemap;
  }

  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

Sitemap: https://bcaprojectsathi.com/sitemap.xml

# Disallow unnecessary paths
Disallow: /admin/
Disallow: /private/
Disallow: /*.json$
Disallow: /api/

# Allow search engines to crawl important content
Allow: /projects/
Allow: /services/
Allow: /about/
Allow: /contact/

# Crawl delay
Crawl-delay: 1`;
  }
}