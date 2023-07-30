import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GetAllProdutosResponse } from 'src/app/models/interfaces/produtos/response/GetAllProdutosResponse';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookieService.get('USER_INFO');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  }

  constructor(private httpClient: HttpClient, private cookieService: CookieService) { }

  getAllProdutos(): Observable<Array<GetAllProdutosResponse>> {
    return this.httpClient.get<Array<GetAllProdutosResponse>> (
      `${this.API_URL}/produtos`,
      this.httpOptions
    )
    .pipe(map((produto) => produto.filter((data) => data?.valorPremioLiquido > 0)));
  }
}
