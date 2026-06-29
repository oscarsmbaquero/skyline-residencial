import { Component, Input, Output, EventEmitter, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlatDataService } from '../../../services/flat-data.service';
import { Flat } from '../../../models/flat.model';

interface FpRect {
  id: string;
  flat: Flat;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  textFill: string;
  labelX: number;
  labelY: number;
}

@Component({
  selector: 'app-floor-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floor-plan.component.html',
})
export class FloorPlanComponent implements OnChanges {
  @Input() block = 'A';
  @Input() floor = 1;
  @Input() selectedId: string | null = null;
  @Output() flatSelected = new EventEmitter<string>();

  rects: FpRect[] = [];

  private svc = inject(FlatDataService);

  private readonly layout = [
    { letter: 'A', x: 20,  y: 20,  w: 200, h: 150 },
    { letter: 'B', x: 240, y: 20,  w: 200, h: 150 },
    { letter: 'C', x: 240, y: 190, w: 200, h: 150 },
    { letter: 'D', x: 20,  y: 190, w: 200, h: 150 },
  ];

  ngOnChanges(): void {
    this.buildRects();
  }

  buildRects(): void {
    const flats = this.svc.getFlatsForBlockAndFloor(this.block, this.floor);
    this.rects = this.layout.map(l => {
      const flat = flats.find(f => f.letter === l.letter);
      if (!flat) return null;
      return {
        id: flat.id,
        flat,
        x: l.x,
        y: l.y,
        w: l.w,
        h: l.h,
        fill: this.statusFill(flat.status),
        textFill: this.statusText(flat.status),
        labelX: l.x + l.w / 2,
        labelY: l.y + l.h / 2,
      };
    }).filter((r): r is FpRect => r !== null);
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

  onRectClick(id: string): void {
    this.flatSelected.emit(id);
  }
}
