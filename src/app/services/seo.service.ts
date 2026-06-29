import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private titleSvc = inject(Title);
  private metaSvc  = inject(Meta);

  private readonly SITE_NAME = 'Skyline Residencial';
  private readonly BASE_URL  = 'https://skylineresidencial.es';
  private readonly OG_IMAGE  = 'https://skylineresidencial.es/assets/og-skyline.jpg';

  set(cfg: SeoConfig): void {
    const fullTitle = `${cfg.title} | ${this.SITE_NAME}`;

    this.titleSvc.setTitle(fullTitle);

    // Básicos
    this.metaSvc.updateTag({ name: 'description', content: cfg.description });
    if (cfg.keywords) {
      this.metaSvc.updateTag({ name: 'keywords', content: cfg.keywords });
    }

    // Open Graph
    this.metaSvc.updateTag({ property: 'og:site_name', content: this.SITE_NAME });
    this.metaSvc.updateTag({ property: 'og:title',       content: fullTitle });
    this.metaSvc.updateTag({ property: 'og:description', content: cfg.description });
    this.metaSvc.updateTag({ property: 'og:image',       content: cfg.ogImage ?? this.OG_IMAGE });
    this.metaSvc.updateTag({ property: 'og:type',        content: 'website' });
    if (cfg.canonical) {
      this.metaSvc.updateTag({ property: 'og:url', content: `${this.BASE_URL}${cfg.canonical}` });
    }

    // Twitter Card
    this.metaSvc.updateTag({ name: 'twitter:card',        content: 'summary_large_image' });
    this.metaSvc.updateTag({ name: 'twitter:title',       content: fullTitle });
    this.metaSvc.updateTag({ name: 'twitter:description', content: cfg.description });
    this.metaSvc.updateTag({ name: 'twitter:image',       content: cfg.ogImage ?? this.OG_IMAGE });
  }
}
