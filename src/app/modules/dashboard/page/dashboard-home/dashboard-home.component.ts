import { MessageService } from 'primeng/api';
import { ProdutosService } from './../../../../services/produtos/produtos.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GetAllProdutosResponse } from 'src/app/models/interfaces/produtos/response/GetAllProdutosResponse';
import { ProdutosDataTransferService } from 'src/app/shared/services/produtos/produtos-data-transfer.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChartData, ChartOptions } from 'chart.js';
import { GetQuantidadeProdutosPorTipo } from 'src/app/models/interfaces/produtos/response/GetQuantidadeProdutosPorTipo';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: [],
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public produtosList: Array<GetAllProdutosResponse> = [];
  public quantidadeProdutosPorTipoList: Array<GetQuantidadeProdutosPorTipo> = [];

  public produtosChartDatas!: ChartData;
  public produtosChartOptions!: ChartOptions;

  constructor(
    private produtosService: ProdutosService,
    private messageService: MessageService,
    private produtosDataTransferService: ProdutosDataTransferService
  ) {}

  ngOnInit(): void {
    this.getQuantidadeProdutosPorTipo();
  }

  getQuantidadeProdutosPorTipo(): void {
    this.produtosService
      .getQuantidadeProdutosPorTipo()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.quantidadeProdutosPorTipoList = response;
            this.produtosDataTransferService.setQuantidadeProdutosPorTIpo(this.quantidadeProdutosPorTipoList);
            this.setProdutosChartConfig();
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar Produtos!',
            life: 2500,
          });
        },
      });
  }

  setProdutosChartConfig() {
    if (this.quantidadeProdutosPorTipoList.length > 0) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--text-color-secondary'
      );
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.produtosChartDatas = {
        labels: this.quantidadeProdutosPorTipoList.map((element) => element?.tipo),
        datasets: [
          {
            label: 'Quantidade de Produtos vendidos',
            backgroundColor: [
              documentStyle.getPropertyValue('--indigo-400'),
              documentStyle.getPropertyValue('--green-400'),
              documentStyle.getPropertyValue('--yellow-400'),
              documentStyle.getPropertyValue('--cyan-400'),
              documentStyle.getPropertyValue('--pink-400'),
              documentStyle.getPropertyValue('--purple-400'),
              documentStyle.getPropertyValue('--primary-400'),
              documentStyle.getPropertyValue('--red-400'),
              documentStyle.getPropertyValue('--gray-400'),


            ],
            borderColor: documentStyle.getPropertyValue('--indigo-400'),
            hoverBackgroundColor:[
              documentStyle.getPropertyValue('--indigo-600'),
              documentStyle.getPropertyValue('--green-600'),
              documentStyle.getPropertyValue('--yellow-600'),
              documentStyle.getPropertyValue('--cyan-600'),
              documentStyle.getPropertyValue('--pink-600'),
              documentStyle.getPropertyValue('--purple-600'),
              documentStyle.getPropertyValue('--primary-600'),
              documentStyle.getPropertyValue('--red-600'),
              documentStyle.getPropertyValue('--gray-600'),

            ],
            data: this.quantidadeProdutosPorTipoList.map((element) => element?.quantidade),
          },
        ],
      };

      this.produtosChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },

        scales: {
          x: {
            ticks: {
              color: textColor,
              font: {
                weight: '500',
              },
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
