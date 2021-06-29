import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../shared/services/material.service";
import {OrdersService} from "../shared/services/orders.service";
import {AbstractComponent} from "../abstract.component";
import {filter, takeUntil} from "rxjs/operators";
import {Filter, Order} from "../shared/interfaces";

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent extends AbstractComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip')
  public tooltipRef: ElementRef;
  public tooltip: MaterialInstance;
  public isFilterVisible: boolean;
  public loading: boolean;
  public reloading: boolean;
  public lastOrderReached: boolean;
  public orders: Order[] = [];

  public offset = 0;
  public limit = STEP;
  public filter: Filter;

  constructor(private ordersService: OrdersService) {
    super();
  }

  public ngOnInit(): void {
    this.reloading = true;
    this.fetch();
  }

  public ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  public ngOnDestroy(): void {
    this.tooltip.destroy();
    super.ngOnDestroy();
  }

  public fetch() {
    const params = Object.assign({}, this.filter, {offset: this.offset, limit: this.limit})
    this.ordersService.fetch(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(orders => {
        this.orders = this.orders.concat(orders);
        this.lastOrderReached = orders.length < STEP;
        this.loading = false;
        this.reloading = false;
      })
  }

  public onLoadMoreClick() {
    this.offset += STEP;
    this.loading = true;
    this.fetch();
  }

  public applyFilter(newFilter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.filter = newFilter;
    this.reloading = true;
    this.fetch();
  }

  public isFiltered(): boolean {
    return this.filter && !!Object.keys(this.filter)?.length;
  }
}
