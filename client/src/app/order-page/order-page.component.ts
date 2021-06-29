import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {AbstractComponent} from "../abstract.component";
import {takeUntil} from "rxjs/operators";
import {MaterialInstance, MaterialService} from "../shared/services/material.service";
import {OrderService} from "./order.service";
import {Order, OrderPosition} from "../shared/interfaces";
import {OrdersService} from "../shared/services/orders.service";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})
export class OrderPageComponent extends AbstractComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal')
  public modalRef: ElementRef;
  public pending: boolean;
  private modal: MaterialInstance;

  public isRoot: boolean;

  constructor(private router: Router,
              private ordersService: OrdersService,
              public orderService: OrderService) {
    super();
    this.router.events
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.isRoot = this.router.url === '/order';
        }
      })
  }

  public ngOnInit(): void {
  }

  public ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  public ngOnDestroy() {
    this.modal.destroy();
    super.ngOnDestroy();
  }

  public onFinishClick() {
    this.modal.open();
  }

  public onCancelClick() {
    this.modal.close();
  }

  public onSubmitClick() {
    const order: Order = {
      list: this.orderService.list.map(item => {
        delete item._id;
        return item;
      })
    };

    this.pending = true;
    this.ordersService.create(order)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(newOrder => {
          MaterialService.toast(`Order #${newOrder.order} was successfully created`);
          this.orderService.clear();
        }, error => console.error(error?.error?.message),
        () => {
          this.modal.close();
          this.pending = false;
        })
  }

  public onDeleteClick(item: OrderPosition) {
    this.orderService.remove(item);
  }
}
