import { Component, OnInit, inject } from '@angular/core';
import { ProcessComponent } from '../../components/process/process.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-proceso-page',
  standalone: true,
  imports: [ProcessComponent],
  template: `<app-process></app-process>`,
})
export class ProcesoPage implements OnInit {
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.set({
      title: 'Proceso de Compra VPO · Paso a Paso',
      description: 'Cómo comprar una vivienda VPO en Plasencia: registro de demandantes, adjudicación, financiación preferente y firma de escrituras. Guía completa paso a paso.',
      keywords: 'proceso compra VPO, cómo comprar VPO Plasencia, registro demandantes Extremadura',
      canonical: '/proceso',
    });
  }
}
