import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Filter} from "../../shared/interfaces";
import {MaterialDatePicker, MaterialService} from "../../shared/services/material.service";

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.css']
})
export class HistoryFilterComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output()
  public filter: EventEmitter<Filter> = new EventEmitter<Filter>();

  @ViewChild('start')
  public startRef: ElementRef;
  @ViewChild('end')
  public endRef: ElementRef;

  public order: number;
  public start: MaterialDatePicker;
  public end: MaterialDatePicker;

  public isValidDate: boolean = true;

  constructor() {
  }

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
    this.start = MaterialService.initDatePicker(this.startRef, this.validateDate.bind(this));
    this.end = MaterialService.initDatePicker(this.endRef, this.validateDate.bind(this));
  }

  public ngOnDestroy(): void {
    this.start.destroy();
    this.end.destroy();
  }

  private validateDate(): void {
    if (!this.start.date || !this.end.date) {
      this.isValidDate = true;
      return;
    }

    this.isValidDate = this.start.date < this.end.date;
  }

  public onApplyFilterClick() {
    const filter: Filter = {};
    if (this.order) {
      filter.order = this.order;
    }

    if (this.start.date) {
      filter.start = this.start.date;
    }

    if (this.end.date) {
      filter.end = this.end.date;
    }

    this.filter.emit(filter);
  }
}
