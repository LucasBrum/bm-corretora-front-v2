import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AuthRequest } from 'src/app/models/interfaces/auth/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/auth/AuthResponse';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequests';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SigupUserResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  jwtService: JwtHelperService = new JwtHelperService();

  private API_URL = environment.API_URL;
  private API_LOGIN = environment.API_LOGIN;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  signupUser(signupUserRequest: SignupUserRequest): Observable<SignupUserResponse> {
    return this.http.post<SignupUserResponse> (`${this.API_URL}/login`, signupUserRequest);
  }

  authUser(authRequest: AuthRequest) {
    return this.http.post(`${this.API_LOGIN}/login`, authRequest, {
      observe: 'response',
      responseType: 'text'
    });
  }

  successfullLogin(authToken: string) {
    localStorage.setItem('token', authToken);
  }

  isAuthenticated() {
    let token = localStorage.getItem('token')
    if (token != null) {
      return !this.jwtService.isTokenExpired(token);
    }

    return false;
  }

  isLoggedIn(): boolean {
    const JWT_TOKEN = this.cookieService.get('USER_INFO');
    return JWT_TOKEN ? true : false;

  }

  logout() {
    localStorage.clear();
  }

}
