import { Component, OnInit, inject } from '@angular/core';
import { ViviendaSelectorComponent } from '../../components/vivienda-selector/vivienda-selector.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-pisos-page',
  standalone: true,
  imports: [ViviendaSelectorComponent],
  template: `<app-vivienda-selector></app-vivienda-selector>`,
})
export class PisosPage implements OnInit {
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.set({
      title: 'Pisos Disponibles · VPO La Mazuela',
      description: 'Consulta los 54 pisos disponibles en La Mazuela, Plasencia. Filtra por portal, planta y dormitorios. Precio VPO tasado con garaje incluido.',
      keywords: 'pisos disponibles VPO Plasencia, apartamentos La Mazuela, comprar piso VPO Plasencia',
      canonical: '/pisos',
    });
  }
}
