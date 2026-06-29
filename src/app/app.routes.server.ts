import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Estrategia de render por ruta:
 *
 * Server → SSR dinámico en cada petición.
 *   Google indexa el HTML completo → SEO completo.
 *   Sin restricciones de browser APIs en build time.
 *
 * Client → SPA pura (sin SSR).
 *   Para /pisos: selector interactivo que no necesita indexación.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '',          renderMode: RenderMode.Server },
  { path: 'promocion', renderMode: RenderMode.Server },
  { path: 'pisos',     renderMode: RenderMode.Client },
  { path: 'calidades', renderMode: RenderMode.Server },
  { path: 'galeria',   renderMode: RenderMode.Server },
  { path: 'proceso',   renderMode: RenderMode.Server },
  { path: 'faq',       renderMode: RenderMode.Server },
  { path: 'contacto',  renderMode: RenderMode.Server },
  { path: 'admin/login', renderMode: RenderMode.Client },
  { path: 'admin',       renderMode: RenderMode.Client },
  { path: '**',          renderMode: RenderMode.Client },
];
