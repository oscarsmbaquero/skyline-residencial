import { Component, OnInit, inject } from '@angular/core';
import { LocationComponent } from '../../components/location/location.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-promocion-page',
  standalone: true,
  imports: [LocationComponent],
  template: `<app-location></app-location>`,
})
export class PromocionPage implements OnInit {
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.set({
      title: 'La Promoción · La Mazuela Plasencia',
      description: 'Conoce la promoción VPO La Mazuela en C/ Hermandad de Jesús de la Pasión, Plasencia. 3 portales, 5 plantas, 54 viviendas en el nuevo barrio de La Mazuela.',
      keywords: 'promoción VPO Plasencia, La Mazuela Plasencia, barrio La Mazuela, Cáceres',
      canonical: '/promocion',
    });
  }
}
