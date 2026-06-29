import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, catchError, throwError } from 'rxjs';
import { Vivienda } from '../models/vivienda.model';
import { environment } from '../../enviroment/environment';

type Status = 0 | 1 | 2;

const STATUS_LABELS: Record<Status, string> = {
  0: 'Disponible',
  1: 'Reservada',
  2: 'Vendida'
};

const STATUS_KEYS: Record<Status, 'avail' | 'reserv' | 'sold'> = {
  0: 'avail',
  1: 'reserv',
  2: 'sold'
};

@Injectable({ providedIn: 'root' })
export class ViviendaDataService {

  private http = inject(HttpClient);

  private viviendasSubject = new BehaviorSubject<Vivienda[]>([]);
  viviendas$ = this.viviendasSubject.asObservable();

  get viviendas(): Vivienda[] {
    return this.viviendasSubject.value;
  }

  // 📥 CARGA INICIAL
  loadViviendas(): Observable<Vivienda[]> {
  const endpoint = `${environment.apiUrl}viviendas`;

  return this.http.get<{ status: number; data: Vivienda[] }>(endpoint).pipe(
    map(res => res.data),
    tap(viviendas => this.viviendasSubject.next(viviendas)),
    catchError((error: HttpErrorResponse) => {
      console.error('Error al obtener las viviendas:', error);
      return throwError(() => error);
    })
  );
}


// 🔄 CAMBIAR STATUS
updateStatus(ficha: string, status: Status): Observable<void> {
  return this.http.patch<void>(
    `${environment.apiUrl}viviendas/${ficha}/status`,
    { status }
  ).pipe(
    tap(() => {
      const updated = this.viviendas.map(v => {
        if (v.ficha !== ficha) {
          return v;
        }

        return {
          ...v,
          status,
          statusLabel: STATUS_LABELS[status],
          statusKey: STATUS_KEYS[status]
        };
      });

      this.viviendasSubject.next(updated);
    }),
    map(() => void 0)
  );
}

  // 📊 SUMMARY
  get summary() {
    const v = this.viviendas;
    return {
      total: v.length,
      avail: v.filter(x => x.status === 0).length,
      reserv: v.filter(x => x.status === 1).length,
      sold: v.filter(x => x.status === 2).length
    };
  }

  // 🧮 HELPERS
  countAvail(portal: number) {
    return this.viviendas.filter(v => v.portal === portal && v.status === 0).length;
  }

  totalByPortal(portal: number) {
    return this.viviendas.filter(v => v.portal === portal).length;
  }

  portales = [1, 2, 3] as const;

  plantas = ['Baja','Primera','Segunda','Tercera','Ático'] as const;

  plantaLabel: Record<string, string> = {
    Baja: 'Planta Baja',
    Primera: 'Planta 1ª',
    Segunda: 'Planta 2ª',
    Tercera: 'Planta 3ª',
    Ático: 'Planta Ático'
  };

  plantaShort: Record<string, string> = {
    Baja: 'Baja',
    Primera: '1ª',
    Segunda: '2ª',
    Tercera: '3ª',
    Ático: 'Ático'
  };
}