import {Injectable, OnDestroy} from "@angular/core";
import {Subject} from "rxjs";

@Injectable()
export abstract class AbstractComponent implements OnDestroy {
  protected unsubscribe$: Subject<void> = new Subject();

  public ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
