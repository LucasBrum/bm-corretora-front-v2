import { MessageService } from 'primeng/api';
import { ProdutosService } from './../../../../services/produtos/produtos.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GetAllProdutosResponse } from 'src/app/models/interfaces/produtos/response/GetAllProdutosResponse';
import { ProdutosDataTransferService } from 'src/app/shared/services/produtos/produtos-data-transfer.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: [],
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public produtosList: Array<GetAllProdutosResponse> = [];

  public produtosChartDatas!: ChartData;
  public produtosChartOptions!: ChartOptions;

  constructor(
    private produtosService: ProdutosService,
    private messageService: MessageService,
    private produtosDataTransferService: ProdutosDataTransferService
  ) {}

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
    if (this.produtosList.length > 0) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--text-color-secondary'
      );
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.produtosChartDatas = {
        labels: this.produtosList.map((element) => element?.tipo),
        datasets: [
          {
            label: 'Valor prêmio Liquído',
            backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
            borderColor: documentStyle.getPropertyValue('--indigo-400'),
            hoverBackgroundColor:
              documentStyle.getPropertyValue('--indigo-500'),
            data: this.produtosList.map((element) => element?.valorPremioLiquido),
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
