import { Component, Input } from '@angular/core';
import { GetAllProdutosResponse } from 'src/app/models/interfaces/produtos/response/GetAllProdutosResponse';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: []
})
export class ProductsTableComponent {

  @Input() products: Array<GetAllProdutosResponse> = [];

  public productSelected! : GetAllProdutosResponse

}
