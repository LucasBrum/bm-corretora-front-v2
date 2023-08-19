import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { EventAction } from 'src/app/models/interfaces/event/EventAction';
import { GetAllProdutosResponse } from 'src/app/models/interfaces/produtos/response/GetAllProdutosResponse';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss']
})
export class ProductsTableComponent {

  @Input() products: Array<GetAllProdutosResponse> = [];
  @Output() productEvent = new EventEmitter<EventAction>();

  public productSelected! : GetAllProdutosResponse
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;

  handleProductEvent(action: string, id?: string): void {
    if (action && action != '') {
      const productEventData = id && id !== '' ? { action, id } : { action };

      // Emite o valor do Evento. Ps: Conceito de Output.
      this.productEvent.emit(productEventData);

    }
  }

}
