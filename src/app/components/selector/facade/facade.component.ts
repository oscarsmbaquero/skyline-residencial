import { Component, Input, Output, EventEmitter, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlatDataService } from '../../../services/flat-data.service';
import { Flat } from '../../../models/flat.model';

interface FacadeCell {
  id: string;
  flat: Flat;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  textFill: string;
}

@Component({
  selector: 'app-facade',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './facade.component.html',
})
export class FacadeComponent implements OnChanges {
  @Input() block = 'A';
  @Input() selectedId: string | null = null;
  @Output() flatSelected = new EventEmitter<string>();
  @Output() floorHovered = new EventEmitter<number>();

  cells: FacadeCell[] = [];

  private svc = inject(FlatDataService);

  // SVG layout constants
  readonly svgW = 600;
  readonly svgH = 520;
  readonly marginLeft = 60;
  readonly marginRight = 60;
  readonly marginTop = 40;
  readonly marginBottom = 80;
  readonly winW = 96;
  readonly winGapX = 8;
  readonly winGapY = 10;
  readonly floors = 5;
  readonly letters = ['A', 'B', 'C', 'D'];

  ngOnChanges(): void {
    this.buildCells();
  }

  buildCells(): void {
    const usableW = this.svgW - this.marginLeft - this.marginRight;
    const usableH = this.svgH - this.marginTop - this.marginBottom;
    const totalWinW = this.letters.length * this.winW + (this.letters.length - 1) * this.winGapX;
    const startX = this.marginLeft + (usableW - totalWinW) / 2;
    const rowH = (usableH - (this.floors - 1) * this.winGapY) / this.floors;

    this.cells = [];
    for (let fi = 0; fi < this.floors; fi++) {
      const floor = this.floors - fi;
      const y = this.marginTop + fi * (rowH + this.winGapY);
      for (let li = 0; li < this.letters.length; li++) {
        const letter = this.letters[li];
        const x = startX + li * (this.winW + this.winGapX);
        const flatsForFloor = this.svc.getFlatsForBlockAndFloor(this.block, floor);
        const flat = flatsForFloor.find(f => f.letter === letter);
        if (!flat) continue;
        this.cells.push({
          id: flat.id,
          flat,
          x,
          y,
          w: this.winW,
          h: rowH,
          fill: this.statusFill(flat.status),
          textFill: this.statusText(flat.status),
        });
      }
    }
  }

  statusFill(status: number): string {
    if (status === 0) return '#D9E6DD';
    if (status === 1) return '#EDE2CB';
    return '#E5D0CD';
  }

  statusText(status: number): string {
    if (status === 0) return '#2E5A41';
    if (status === 1) return '#6E4F1F';
    return '#6B2F2A';
  }

  floorLabel(floor: number): string {
    return floor === 1 ? 'Baja' : `${floor - 1}ª`;
  }

  getFloorY(floor: number): number {
    const fi = this.floors - floor;
    const usableH = this.svgH - this.marginTop - this.marginBottom;
    const rowH = (usableH - (this.floors - 1) * this.winGapY) / this.floors;
    return this.marginTop + fi * (rowH + this.winGapY) + rowH / 2;
  }

  onCellClick(id: string): void {
    this.flatSelected.emit(id);
  }

  onCellMouseEnter(floor: number): void {
    this.floorHovered.emit(floor);
  }

  floorNumbers(): number[] {
    return [5, 4, 3, 2, 1];
  }
}
