


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,BehaviorSubject,tap} from 'rxjs';
import { LoginRequest , LoginResponse , User } from '@core/models/auth.model';
import { environment } from '@env/environments';

@Injectable({
  providedIn: 'root'
})  


export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());


  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) { }


  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, credentials).pipe(
      tap(response => {
        this.storeToken(response.token);
        this.storeUser(response.user);
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }  


  logout(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.userKey);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }


  getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }
 
  isAuthenticated(): boolean {
    return this.hasValidToken();
  }


  private storeToken(token: string): void {
    localStorage.setItem(environment.tokenKey, token);
  }

  private storeUser(user : User): void {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
  }



  private getStoredUser(): User | null {
     const stored = localStorage.getItem(environment.userKey);
     if(!stored) {
       return null;
     }
     try{
        return JSON.parse(stored) as User;
     }catch{
        return null;
     }
     
  }
   
  private hasValidToken(): boolean { 
     const token = this.getToken();
     return !!token && token.length > 0;
   }

}