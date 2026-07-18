import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  //  {
  //   path: '',
  //   loadComponent: () => import('./pages/temporal/temporal.component').then(m => m.TemporalComponent),
  // },
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'promocion',
    loadComponent: () => import('./pages/promocion/promocion.page').then(m => m.PromocionPage),
  },
  {
    path: 'pisos',
    loadComponent: () => import('./pages/pisos/pisos.page').then(m => m.PisosPage),
  },
  {
    path: 'calidades',
    loadComponent: () => import('./pages/calidades/calidades.page').then(m => m.CalidadesPage),
  },
  {
    path: 'galeria',
    loadComponent: () => import('./pages/galeria/galeria.page').then(m => m.GaleriaPage),
  },
  {
    path: 'proceso',
    loadComponent: () => import('./pages/proceso/proceso.page').then(m => m.ProcesoPage),
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq.page').then(m => m.FaqPage),
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contacto/contacto.page').then(m => m.ContactoPage),
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.page').then(m => m.AdminPage),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
