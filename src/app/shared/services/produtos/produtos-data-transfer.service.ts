import { GetQuantidadeProdutosPorTipo } from './../../../models/interfaces/produtos/response/GetQuantidadeProdutosPorTipo';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { GetAllProdutosResponse } from 'src/app/models/interfaces/produtos/response/GetAllProdutosResponse';

@Injectable({
  providedIn: 'root'
})
export class ProdutosDataTransferService {
  public produtosDataEmitter$ = new BehaviorSubject<Array<GetAllProdutosResponse | null>>(null);
  public quantidadeProdutosPorTipoDataEmitter$ = new BehaviorSubject<Array<GetQuantidadeProdutosPorTipo | null>>(null);

  public produtosList: Array<GetAllProdutosResponse> = [];
  public quantidadeProdutosPorTipoList: Array<GetQuantidadeProdutosPorTipo> = [];

  setProdutos(produtos: Array<GetAllProdutosResponse>): void {
    if (produtos) {
      this.produtosDataEmitter$.next(produtos);
      this.getProdutosList();
    }
  }

  setQuantidadeProdutosPorTIpo(produtos: Array<GetQuantidadeProdutosPorTipo>): void {
    if (produtos) {
      this.quantidadeProdutosPorTipoDataEmitter$.next(produtos);
      this.getQuantidadeProdutosPorTipoList();
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

  getQuantidadeProdutosPorTipoList() {
    this.quantidadeProdutosPorTipoDataEmitter$
      .subscribe({
        next: (response) => {
          if (response) {
            this.quantidadeProdutosPorTipoList = response;
          }
        }
      });

      return this.quantidadeProdutosPorTipoList;
  }
}
