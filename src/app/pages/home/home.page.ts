import { Component, OnInit, inject } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeroComponent],
  template: `<app-hero></app-hero>`,
})
export class HomePage implements OnInit {
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.set({
      title: 'Viviendas VPO en Plasencia · La Mazuela',
      description: '54 viviendas VPO de 2 y 3 dormitorios en La Mazuela, Plasencia (Cáceres). Precio tasado, garaje incluido, certificación energética A. Entrega Q3 2027.',
      keywords: 'VPO Plasencia, viviendas protegidas Plasencia, La Mazuela, pisos VPO Cáceres, Skyline Residencial',
      canonical: '/',
    });
  }
}
