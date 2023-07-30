import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { GetAllProdutosResponse } from 'src/app/models/interfaces/produtos/response/GetAllProdutosResponse';

@Injectable({
  providedIn: 'root'
})
export class ProdutosDataTransferService {
  public produtosDataEmitter$ = new BehaviorSubject<Array<GetAllProdutosResponse | null>>(null);
  public produtosList: Array<GetAllProdutosResponse> = [];

  setProdutos(produtos: Array<GetAllProdutosResponse>): void {
    if (produtos) {
      this.produtosDataEmitter$.next(produtos);
      this.getProdutosList();
    }
  }
  getProdutosList() {
    this.produtosDataEmitter$
      .pipe(
        take(1),
        map((data) => data?.filter((produto) => produto.valorPremioLiquido > 0))
      ).subscribe({
        next: (response) => {
          if (response) {
            this.produtosList = response;
          }
        }
      });

      return this.produtosList;

  }
}
