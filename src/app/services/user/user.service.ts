import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRequest } from 'src/app/auth/AuthRequest';
import { AuthResponse } from 'src/app/auth/AuthResponse';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequests';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SigupUserResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) { }

  sigupUser(signupUserRequest: SignupUserRequest): Observable<SignupUserResponse> {
    return this.http.post<SignupUserResponse> (`${this.API_URL}/usuarios`, signupUserRequest);
  }

  authUser(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, authRequest);
  }
}