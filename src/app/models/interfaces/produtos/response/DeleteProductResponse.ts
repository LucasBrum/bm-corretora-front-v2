export interface DeleteProductResponse {
  id: string;
  tipo: string;
  seguradora: string;
  coCorretagem: boolean;
  dataVigencia: Date;
  valorPremioLiquido: number;
  comissaoVendaPorcentagem: number;
  valorComissaoReceber: number;
  agenciamentoPorcentagem: number;
  idCliente: number;
  nomeCliente: string;
}
