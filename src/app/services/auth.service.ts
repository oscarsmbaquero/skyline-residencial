import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../enviroment/environment';
import { IUser, IUserResponse } from '../models/user-models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<IUserResponse | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  login(username: string, password: string): Observable<boolean> {
    const endpoint = `${environment.apiUrl}users/login`;

    return this.http
      .post<IUser>(endpoint, {
        user: username,
        password: password,
      })
      .pipe(
        map((user) => {
          if (!user) return false;

          const userResponse: IUserResponse = { data: user };

          this.currentUserSubject.next(userResponse);
          localStorage.setItem('user', JSON.stringify(userResponse));

          return true;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error login:', error);
          return throwError(() => error);
        })
      );
  }

  getCurrentUser(): Observable<IUserResponse | null> {
    return this.currentUser$;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
  }

  isLogged(): boolean {
    return !!this.currentUserSubject.value;
  }
}