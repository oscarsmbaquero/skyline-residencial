import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ViviendaDataService } from '../../services/vivienda-data.service';
import { Vivienda } from '../../models/vivienda.model';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.page.html',
  styleUrl: './admin.page.css',
})
export class AdminPage implements OnInit {
  private auth = inject(AuthService);
  readonly svc  = inject(ViviendaDataService);

  loading = true;
  saving  = new Set<string>();

  get viviendas(): Vivienda[] { return this.svc.viviendas; }
  get summary() { return this.svc.summary; }

ngOnInit(): void {
  this.svc.loadViviendas().subscribe({
    complete: () => (this.loading = false)
  });
}

  setStatus(ficha: string, status: 0|1|2): void {
    this.saving.add(ficha);
    this.svc.updateStatus(ficha, status).subscribe({
      complete: () => this.saving.delete(ficha),
      error:    () => this.saving.delete(ficha),
    });
  }

  isSaving(ficha: string): boolean { return this.saving.has(ficha); }

  logout(): void { this.auth.logout(); }

  statusLabel(s: 0|1|2): string {
    return s === 0 ? 'Disponible' : s === 1 ? 'Reservada' : 'Vendida';
  }
}
