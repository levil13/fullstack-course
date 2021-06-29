import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Order} from "../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../shared/services/material.service";

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnDestroy, AfterViewInit {
  @Input()
  public orders: Order[];

  @ViewChild('modal')
  public modalRef: ElementRef;
  public modal: MaterialInstance;

  public selectedOrder: Order;

  public ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  public ngOnDestroy(): void {
    this.modal.destroy();
  }

  public calculatePrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return total += (item.quantity * item.price)
    }, 0)
  }

  public onSelectOrderClick(order: Order) {
    this.selectedOrder = order;
    this.modal.open();
  }

  public onCloseModalClick() {
    this.modal.close();
  }
}
