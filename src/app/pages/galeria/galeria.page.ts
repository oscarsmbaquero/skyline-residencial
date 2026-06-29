import { Component, OnInit, inject } from '@angular/core';
import { GalleryComponent } from '../../components/gallery/gallery.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-galeria-page',
  standalone: true,
  imports: [GalleryComponent],
  template: `<app-gallery></app-gallery>`,
})
export class GaleriaPage implements OnInit {
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.set({
      title: 'Galería · Imágenes de La Mazuela',
      description: 'Galería fotográfica de la promoción VPO La Mazuela en Plasencia. Exterior, zonas comunes, tipologías de viviendas de 2 y 3 dormitorios.',
      keywords: 'fotos VPO Plasencia, galería La Mazuela, imágenes promoción Plasencia',
      canonical: '/galeria',
    });
  }
}
