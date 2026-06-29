import { environment } from '../../enviroment/environment'; 
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { IUser, IUserResponse } from '../models/user-models'; 
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private currentUserSubject = new BehaviorSubject<IUserResponse | null>(null);
  public currentUser$: Observable<IUserResponse | null>;

  constructor(private httpClient: HttpClient) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
    this.currentUser$ = this.currentUserSubject.asObservable();
  }
  login(credentials: { user: string; password: string }): Observable<boolean> {
    const endpoint = `${environment.apiUrl}users/login`;
    return this.httpClient.post<IUser>(endpoint, credentials).pipe(
      map((user) => {
        if (user) {
          const userResponse: IUserResponse = {
            data: user
          };
          this.currentUserSubject.next(userResponse);
          localStorage.setItem('user', JSON.stringify(user));
          return true;
        } else {
          return false;
        }
      })
    );
  }

  getCurrentUser(): Observable<IUserResponse | null> {
    return this.currentUserSubject.asObservable();
  }

  setCurrentUser(user: IUser) {
    const userResponse: IUserResponse = {
      data: user
    };
    this.currentUserSubject.next(userResponse);
    localStorage.setItem('user', JSON.stringify(userResponse));
  }

  clearCurrentUser() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
  }

  getUsers(): Observable<IUser[]> {
  const endpoint = `${environment.apiUrl}users`;
  return this.httpClient.get<IUser[]>(endpoint).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error al obtener los usuarios:', error);
      return throwError(() => error);
    })
  );
}
}
