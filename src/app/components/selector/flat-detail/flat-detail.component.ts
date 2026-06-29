import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flat } from '../../../models/flat.model';

@Component({
  selector: 'app-flat-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flat-detail.component.html',
})
export class FlatDetailComponent {
  @Input() flat: Flat | null = null;

  formatPrice(price: number): string {
    return price.toLocaleString('es-ES') + ' €';
  }

  flatTitle(flat: Flat): string {
    const parts = flat.name.split('·');
    return parts[2] ? parts[2].trim() : flat.letter;
  }
}
