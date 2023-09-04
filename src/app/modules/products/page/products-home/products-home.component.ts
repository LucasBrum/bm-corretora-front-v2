import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventAction } from 'src/app/models/interfaces/event/EventAction';
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
    private messageService: MessageService,
    private confirmationService: ConfirmationService

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

  handleProductAction(event: EventAction): void {
    if (event) {
      console.log('DADOS DO EVENTO RECEBIDO', event);
    }
  }

  handleDeleteProductAction(event: {
    product_id: string;
    productType: string;
    }): void {
      if (event) {
        console.log("DADOS RECEBIDOS DO EVENTO DE DELETAR PRODUTO: ", event)
        this.confirmationService.confirm({
          message: `Confirma a exclusão do produto: ${event?.productType}?`,
          header: 'Confirmação de exclusão',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Sim',
          rejectLabel: 'Não',
          accept: () => this.deleteProduct(event?.product_id),
        });
      }
  }

  deleteProduct(product_id: string) {
    if (product_id) {
      this.produtosService.deleteProduct(product_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto removido com sucesso!',
            life: 2500,
          });
          console.log(response);
          this.getAPIProductsDatas();
        },error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao remover produto!',
            life: 2500
          })


        }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
