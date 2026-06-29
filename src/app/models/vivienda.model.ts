export type Planta = 'Baja' | 'Primera' | 'Segunda' | 'Tercera' | 'Ático';
export type Posicion = 'A' | 'B' | 'C' | 'D';
export type StatusKey = 'avail' | 'reserv' | 'sold';

export interface Vivienda {
  ficha: string;          // '01' … '54'
  portal: 1 | 2 | 3;
  planta: Planta;
  plantaIndex: number;    // 0 … 4 (para ordenación)
  posicion: Posicion;
  dorms: 2 | 3;
  banos: number;
  estancias: string[];
  terraza: boolean;
  patio: boolean;         // Patio Exterior/Interior (solo planta baja)
  garaje: boolean;
  trastero: boolean;
  status: 0 | 1 | 2;     // 0 disponible · 1 reservado · 2 vendido
  statusLabel: string;
  statusKey: StatusKey;
}

export interface ViviendasSummary {
  total: number;
  avail: number;
  reserv: number;
  sold: number;
}
