import { Component, OnInit, inject } from '@angular/core';
import { QualityComponent } from '../../components/quality/quality.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-calidades-page',
  standalone: true,
  imports: [QualityComponent],
  template: `<app-quality></app-quality>`,
})
export class CalidadesPage implements OnInit {
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.set({
      title: 'Calidades y Acabados · La Mazuela',
      description: 'Materiales de primera en La Mazuela: certificación energética A, cocinas Balay-Silestone, baños Roca-Grohe, garaje con preinstalación para cargador eléctrico.',
      keywords: 'calidades VPO Plasencia, acabados vivienda protegida, eficiencia energética A Plasencia',
      canonical: '/calidades',
    });
  }
}
