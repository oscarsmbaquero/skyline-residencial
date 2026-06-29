import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Vivienda, Planta } from '../../models/vivienda.model';
import { ViviendaDataService } from '../../services/vivienda-data.service';

export interface Grupo {
  key: string;
  portalLabel: string;
  plantaLabel: string;
  viviendas: Vivienda[];
}

@Component({
  selector: 'app-vivienda-selector',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './vivienda-selector.component.html',
  styleUrl: './vivienda-selector.component.css',
})
export class ViviendaSelectorComponent implements OnInit {

  public svc = inject(ViviendaDataService);

  readonly portales = this.svc.portales;
  readonly plantas = this.svc.plantas;
  readonly plantaLabel = this.svc.plantaLabel;
  readonly plantaShort = this.svc.plantaShort;

  get summary() {
    return this.svc.summary;
  }

  ngOnInit(): void {
    this.svc.loadViviendas().subscribe();
  }

  // ── FILTROS ─────────────────────────────
  activePortal = 0;
  activePlanta = '';
  activeDorms = 0;

  selectedFicha: string | null = null;

  // ── SELECCIÓN ───────────────────────────
  get selected(): Vivienda | null {
    return this.selectedFicha
      ? this.svc.viviendas.find(v => v.ficha === this.selectedFicha) ?? null
      : null;
  }

  select(ficha: string) {
    this.selectedFicha = this.selectedFicha === ficha ? null : ficha;
  }

  setPortal(p: number) {
    this.activePortal = p;
    this.selectedFicha = null;
  }

  setPlanta(pl: string) {
    this.activePlanta = pl;
    this.selectedFicha = null;
  }

  setDorms(d: number) {
    this.activeDorms = d;
    this.selectedFicha = null;
  }

  // ── FILTRADO ───────────────────────────
  get filtered(): Vivienda[] {
    return this.svc.viviendas.filter(v => {
      if (this.activePortal && v.portal !== this.activePortal) return false;
      if (this.activePlanta && v.planta !== this.activePlanta) return false;
      if (this.activeDorms && v.dorms !== this.activeDorms) return false;
      return true;
    });
  }

  // ── AGRUPACIÓN ─────────────────────────
  get grupos(): Grupo[] {
    const map = new Map<string, Grupo>();

    for (const v of this.filtered) {
      const key = `${v.portal}-${v.plantaIndex}`;

      if (!map.has(key)) {
        map.set(key, {
          key,
          portalLabel: `Portal ${v.portal}`,
          plantaLabel: this.plantaLabel[v.planta],
          viviendas: []
        });
      }

      map.get(key)!.viviendas.push(v);
    }

    return [...map.values()];
  }

  // ── STATUS UI ──────────────────────────
  statusText(s: number): string {
    return s === 0
      ? 'Disponible para reserva'
      : s === 1
        ? 'Reservada · Consultar'
        : 'Sin disponibilidad';
  }
}