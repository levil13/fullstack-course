import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {OverviewPage} from "../shared/interfaces";
import {Observable} from "rxjs";
import {MaterialInstance, MaterialService} from "../shared/services/material.service";

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tapTarget')
  public tapTargetRef: ElementRef;
  public tapTarget: MaterialInstance;

  public yesterdayDate = new Date();

  public overviewData$: Observable<OverviewPage>;

  constructor(private analyticsService: AnalyticsService) {
  }

  public ngOnInit(): void {
    this.yesterdayDate.setDate(this.yesterdayDate.getDate() - 1);
    this.overviewData$ = this.analyticsService.getOverview()
  }

  public ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef);
  }

  public ngOnDestroy(): void {
    this.tapTarget.destroy();
  }

  public onInfoClick() {
    this.tapTarget.open();
  }
}
