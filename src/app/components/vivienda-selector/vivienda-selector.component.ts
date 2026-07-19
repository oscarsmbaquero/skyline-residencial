import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
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
  private http = inject(HttpClient);

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
  fichaAvailable = false;

  // ── SELECCIÓN ───────────────────────────
  get selected(): Vivienda | null {
    return this.selectedFicha
      ? this.svc.viviendas.find(v => v.ficha === this.selectedFicha) ?? null
      : null;
  }

  select(ficha: string) {
    this.selectedFicha = this.selectedFicha === ficha ? null : ficha;
    this.fichaAvailable = false;

    if (this.selected) {
      this.checkFichaAvailability(this.selected);
    }
  }

  private checkFichaAvailability(v: Vivienda) {
    const ficha = v.ficha;

    this.http.head(this.fichaPdfUrl(v), { observe: 'response' }).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      // Evita aplicar el resultado si mientras tanto se seleccionó otra vivienda.
      if (this.selectedFicha === ficha) {
        // El servidor SSR devuelve 200 con el HTML de la app para cualquier
        // ruta no encontrada, así que además del status hay que comprobar
        // que la respuesta sea realmente un PDF.
        const contentType = res?.headers.get('content-type') ?? '';
        this.fichaAvailable = !!res && res.ok && contentType.includes('pdf');
      }
    });
  }

  fichaPdfFilename(v: Vivienda): string {
    const plantaSeg = v.planta === 'Baja'
      ? `BJO. ${v.posicion}`
      : `${v.plantaIndex}º${v.posicion}`;
    return `Bloque ${v.portal}_${plantaSeg}.pdf`;
  }

  fichaPdfUrl(v: Vivienda): string {
    return `assets/fichas/${encodeURIComponent(this.fichaPdfFilename(v))}`;
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