import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../enviroment/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // solo interceptar llamadas a API
  if (!req.url.includes(environment.apiUrl)) {
    return next(req);
  }

  const authService = inject(AuthService);
  const currentUser = authService['currentUserSubject']?.value;

  // si no hay usuario (o viene con forma inesperada), continuar
  if (!currentUser?.data) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        // aquí NO hay token real, así que solo ejemplo
        'X-User': JSON.stringify(currentUser.data),
      },
    })
  );
};