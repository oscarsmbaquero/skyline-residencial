import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqItem {
  q: string;
  a: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
})
export class FaqComponent {
  openIndex: number | null = null;

  items: FaqItem[] = [
    {
      q: '¿Qué es una vivienda VPO de precio tasado?',
      a: 'Las viviendas de Protección Oficial (VPO) de precio tasado son inmuebles cuyo precio máximo de venta está regulado por la Junta de Extremadura. Esto garantiza que el precio sea accesible y esté por debajo del mercado libre, ofreciendo financiación preferente y condiciones ventajosas para el comprador.',
    },
    {
      q: '¿Quién puede acceder a una vivienda VPO?',
      a: 'Para acceder a una VPO debes cumplir los requisitos autonómicos: no ser titular de otra vivienda protegida o libre en el municipio, tener ingresos familiares dentro de los límites establecidos y estar empadronado o tener vínculo laboral en Plasencia. Te asesoramos gratuitamente en la tramitación.',
    },
    {
      q: '¿Cuándo está prevista la entrega de llaves?',
      a: 'La entrega de llaves está prevista para el tercer trimestre de 2027 (Q3·2027). El plazo puede variar según el ritmo de obra y los trámites administrativos. Mantenemos informados a todos los compradores con actualizaciones periódicas del estado de la construcción.',
    },
    {
      q: '¿La plaza de garaje está incluida en el precio?',
      a: 'Sí, todas las viviendas incluyen una plaza de garaje en el precio de venta. Las tipologías A y D incluyen además trastero propio. Las tipologías B y C tienen el trastero como opción opcional con un coste adicional.',
    },
    {
      q: '¿Qué financiación puedo obtener?',
      a: 'Al tratarse de VPO, tienes acceso a financiación preferente a través de las entidades colaboradoras con la Junta de Extremadura. Podemos orientarte con el banco colaborador para obtener las mejores condiciones hipotecarias, habitualmente con tipos de interés reducidos.',
    },
    {
      q: '¿Puedo visitar la zona y el solar?',
      a: 'Por supuesto. Organizamos visitas guiadas al solar y al barrio de La Mazuela todos los sábados por la mañana con cita previa. También disponemos de maqueta física y renders 3D de alta calidad en nuestra oficina de ventas en el centro de Plasencia.',
    },
  ];

  toggle(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }
}
