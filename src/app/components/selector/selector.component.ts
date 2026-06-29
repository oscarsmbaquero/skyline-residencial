import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlatDataService } from '../../services/flat-data.service';
import { Flat, Summary } from '../../models/flat.model';
import { FacadeComponent } from './facade/facade.component';
import { FloorPlanComponent } from './floor-plan/floor-plan.component';
import { FlatDetailComponent } from './flat-detail/flat-detail.component';

@Component({
  selector: 'app-selector',
  standalone: true,
  imports: [CommonModule, FacadeComponent, FloorPlanComponent, FlatDetailComponent],
  templateUrl: './selector.component.html',
})
export class SelectorComponent implements OnInit {
  activeBlock = 'A';
  activeFloor = 1;
  selectedId: string | null = null;
  selectedFlat: Flat | null = null;

  blocks: string[] = [];
  summary!: Summary;
  floors = [1, 2, 3, 4, 5];

  private svc = inject(FlatDataService);

  ngOnInit(): void {
    this.blocks = this.svc.blocks;
    this.summary = this.svc.summary;
  }

  setBlock(block: string): void {
    this.activeBlock = block;
    this.selectedId = null;
    this.selectedFlat = null;
  }

  setFloor(floor: number): void {
    this.activeFloor = floor;
  }

  onFlatSelected(id: string): void {
    this.selectedId = id;
    this.selectedFlat = this.svc.getFlatById(id);
  }

  onFloorHovered(floor: number): void {
    this.activeFloor = floor;
  }

  floorLabel(floor: number): string {
    return floor === 1 ? 'Baja' : `${floor - 1}ª`;
  }

  availCountForBlock(block: string): number {
    return this.svc.getFlatsForBlock(block).filter(f => f.status === 0).length;
  }
}
