import { Component, OnInit, inject } from '@angular/core';
import { ContactComponent } from '../../components/contact/contact.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-contacto-page',
  standalone: true,
  imports: [ContactComponent],
  template: `<app-contact></app-contact>`,
})
export class ContactoPage implements OnInit {
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.set({
      title: 'Contacto · Reservar Visita a La Mazuela',
      description: 'Reserva una visita a la oficina de ventas de Skyline Residencial en Plasencia. Sin compromiso. Atención personalizada lunes a viernes de 9:00 a 18:00.',
      keywords: 'contacto Skyline Residencial, reservar visita VPO Plasencia, oficina ventas Plasencia',
      canonical: '/contacto',
    });
  }
}
