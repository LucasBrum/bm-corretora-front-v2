import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GetAllProdutosResponse } from 'src/app/models/interfaces/produtos/response/GetAllProdutosResponse';
import { ProdutosService } from 'src/app/services/produtos/produtos.service';
import { ProdutosDataTransferService } from 'src/app/shared/services/produtos/produtos-data-transfer.service';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject();

  public productsDatas: Array<GetAllProdutosResponse> = [];

  constructor(
    private produtosService: ProdutosService,
    private produtosDataService: ProdutosDataTransferService,
    private router: Router,
    private messageService: MessageService

  ) {}


    ngOnInit(): void {
        this.getServiceProductsDatas();
    }

  getServiceProductsDatas() {
    const productsLoaded = this.produtosDataService.getProdutosList();

    if (productsLoaded.length > 0) {
      this.productsDatas = productsLoaded;
    } else this.getAPIProductsDatas();

    console.log('DADOS DE PRODUTOS: ', this.productsDatas)
  }

  getAPIProductsDatas() {
    this.produtosService.getAllProdutos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;

            console.log('DADOS DE PRODUTOS API: ', this.productsDatas)
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao Buscar produtos.',
            life: 2500
          })
          this.router.navigate(['/dashboard']);
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
