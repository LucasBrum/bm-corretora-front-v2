import { MessageService } from 'primeng/api';
import { ProdutosService } from './../../../../services/produtos/produtos.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GetAllProdutosResponse } from 'src/app/models/interfaces/produtos/response/GetAllProdutosResponse';
import { ProdutosDataTransferService } from 'src/app/shared/services/produtos/produtos-data-transfer.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public produtosList: Array<GetAllProdutosResponse> = [];

  constructor(
    private produtosService: ProdutosService,
    private messageService: MessageService,
    private produtosDataTransferService: ProdutosDataTransferService){}

  ngOnInit(): void {
      this.getAllProdutos();
  }
  getAllProdutos(): void {
    this.produtosService
      .getAllProdutos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.produtosList = response;
            this.produtosDataTransferService.setProdutos(this.produtosList);
          }
        }, error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar Produtos!',
            life: 2500
          })
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
