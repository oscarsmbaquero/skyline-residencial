import { Component, OnInit, inject } from '@angular/core';
import { FaqComponent } from '../../components/faq/faq.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [FaqComponent],
  template: `<app-faq></app-faq>`,
})
export class FaqPage implements OnInit {
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.set({
      title: 'FAQ VPO · Preguntas Frecuentes sobre Vivienda Protegida',
      description: '¿Qué es la VPO? ¿Puedo vender mi piso? ¿Qué ingresos necesito? Resolvemos todas las dudas sobre viviendas de protección oficial en Extremadura.',
      keywords: 'preguntas VPO, FAQ vivienda protegida, dudas VPO Extremadura, requisitos VPO Plasencia',
      canonical: '/faq',
    });
  }
}
