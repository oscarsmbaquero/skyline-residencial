import { Injectable } from '@angular/core';
import { Flat, Summary } from '../models/flat.model';

const BLOCKS = ['A', 'B'];
const FLOORS_PER_BLOCK = 5;
const FLAT_LETTERS = ['A', 'B', 'C', 'D'];

const ORIENTATIONS: Record<string, string> = {
  A: 'Sureste', B: 'Suroeste', C: 'Noroeste', D: 'Noreste',
};

const TYPOLOGIES: Record<string, { dorms: number; baths: number; util: number; built: number; terrace: number }> = {
  A: { dorms: 3, baths: 2, util: 82, built: 92, terrace: 8 },
  B: { dorms: 2, baths: 2, util: 71, built: 80, terrace: 6 },
  C: { dorms: 2, baths: 1, util: 67, built: 76, terrace: 5 },
  D: { dorms: 3, baths: 2, util: 84, built: 94, terrace: 10 },
};

const STATUS_MAP: Record<string, Record<number, Record<string, number>>> = {
  A: {
    1: { A: 2, B: 2, C: 2, D: 1 },
    2: { A: 2, B: 1, C: 0, D: 2 },
    3: { A: 0, B: 2, C: 1, D: 0 },
    4: { A: 1, B: 0, C: 0, D: 1 },
    5: { A: 0, B: 0, C: 1, D: 0 },
  },
  B: {
    1: { A: 2, B: 1, C: 0, D: 0 },
    2: { A: 1, B: 0, C: 0, D: 1 },
    3: { A: 0, B: 0, C: 1, D: 0 },
    4: { A: 0, B: 0, C: 0, D: 0 },
    5: { A: 1, B: 0, C: 0, D: 0 },
  },
};

const STATUS_LABEL = ['Disponible', 'Reservado', 'Vendido'];
const STATUS_KEY = ['avail', 'reserv', 'sold'];

function priceFor(block: string, floor: number, letter: string): number {
  const t = TYPOLOGIES[letter];
  let base = 1450 * t.built;
  base += (floor - 1) * 2200;
  if (letter === 'A' || letter === 'D') base += 4500;
  if (block === 'B') base += 3000;
  return Math.round(base / 100) * 100;
}

@Injectable({ providedIn: 'root' })
export class FlatDataService {
  readonly blocks: string[] = BLOCKS;
  readonly flatLetters: string[] = FLAT_LETTERS;
  readonly flats: Flat[];
  readonly summary: Summary;

  constructor() {
    const flats: Flat[] = [];
    for (const block of BLOCKS) {
      for (let floor = 1; floor <= FLOORS_PER_BLOCK; floor++) {
        for (const letter of FLAT_LETTERS) {
          const t = TYPOLOGIES[letter];
          const st = STATUS_MAP[block][floor][letter];
          flats.push({
            id: `${block}-${floor}-${letter}`,
            block,
            floor,
            letter,
            floorLabel: floor === 1 ? 'Planta baja' : `Planta ${floor - 1}ª`,
            name: `Bloque ${block} · ${floor === 1 ? 'Baja' : (floor - 1) + 'ª'} · ${letter}`,
            dorms: t.dorms,
            baths: t.baths,
            util: t.util,
            built: t.built,
            terrace: t.terrace,
            parking: 'Incluido',
            storage: letter === 'A' || letter === 'D' ? 'Incluido' : 'Opcional',
            orientation: ORIENTATIONS[letter],
            status: st,
            statusLabel: STATUS_LABEL[st],
            statusKey: STATUS_KEY[st],
            price: priceFor(block, floor, letter),
          });
        }
      }
    }
    this.flats = flats;
    this.summary = {
      total: flats.length,
      avail: flats.filter(f => f.status === 0).length,
      reserv: flats.filter(f => f.status === 1).length,
      sold: flats.filter(f => f.status === 2).length,
    };
  }

  getFlatsForBlock(block: string): Flat[] {
    return this.flats.filter(f => f.block === block);
  }

  getFlatsForBlockAndFloor(block: string, floor: number): Flat[] {
    return this.flats.filter(f => f.block === block && f.floor === floor);
  }

  getFlatById(id: string): Flat | null {
    return this.flats.find(f => f.id === id) ?? null;
  }
}
