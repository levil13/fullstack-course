import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../shared/services/positions.service";
import {Position} from "../../../shared/interfaces";
import {takeUntil} from "rxjs/operators";
import {AbstractComponent} from "../../../abstract.component";
import {MaterialInstance, MaterialService} from "../../../shared/services/material.service";
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {FormUtils} from "../../../utils/FormUtils";

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent extends AbstractComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  public categoryId: string;

  @ViewChild('modal')
  public modalRef: ElementRef;

  public positions: Position[];
  public loading: boolean;
  public positionId: string | null;
  public modal: MaterialInstance;
  public form: FormGroup
  public FormUtils = FormUtils;

  constructor(private positionsService: PositionsService) {
    super();
  }

  public ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      price: new FormControl(1, [Validators.required, Validators.min(1)]),
    })

    this.loading = true;
    this.positionsService.fetch(this.categoryId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(positions => {
        this.positions = positions;
        this.loading = false;
      });
  }

  public ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  public ngOnDestroy() {
    this.modal.destroy();
    super.ngOnDestroy();
  }

  public onSelectPositionClick(position: Position) {
    this.positionId = position._id!;
    this.form.patchValue({name: position.name, price: position.price});
    this.modal.open();
    MaterialService.updateTextFields();
  }

  public onAddPositionClick() {
    this.positionId = null;
    this.form.reset({price: 1});
    this.modal.open();
    MaterialService.updateTextFields();
  }

  public onDeletePositionClick(position: Position) {
    const decision = window.confirm(`Are you sure you want to delete position ${position.name}?`);
    if (decision) {
      this.deletePosition(position._id!);
    }
  }

  private deletePosition(positionId: string): void {
    this.positionsService.delete(positionId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
          const positionIdx = this.positions.findIndex(position => position._id === positionId);
          this.positions.splice(positionIdx, 1);
          MaterialService.toast(response.message);
        },
        error => MaterialService.toast(error?.error?.message)
      );
  }

  public onCancel() {
    this.modal.close();
  }

  public onSubmit() {
    this.form.disable();
    const newPosition: Position = {
      name: this.form.value.name,
      price: this.form.value.price,
      category: this.categoryId
    };

    const onComplete = () => {
      this.form.reset({price: 1});
      this.form.enable();
      this.modal.close();
    }

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionsService.update(newPosition)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(updatedPosition => {
            MaterialService.toast('Position was successfully updated');
            const positionIdx = this.positions.findIndex(position => position._id === updatedPosition._id);
            this.positions[positionIdx] = updatedPosition;
          }, error => MaterialService.toast(error?.error?.message),
          onComplete);
    } else {
      this.positionsService.create(newPosition)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(position => {
            MaterialService.toast('Position was successfully created');
            this.positions.push(position);
          }, error => MaterialService.toast(error?.error?.message),
          onComplete);
    }
  }

  public getErrorMessage(formControlName: string): string | null {
    const formControl = this.form.get(formControlName);
    if (!formControl) return null;
    const errors = formControl.errors;
    if (!errors) return null;

    switch (formControlName) {
      case 'name':
        return this.getNameErrorMessage(errors);
      case 'price':
        return this.getPriceErrorMessage(errors);
      default:
        return null;
    }
  }

  private getNameErrorMessage(errors: ValidationErrors) {
    if (errors.required) {
      return 'Field should not be empty';
    }
    return null;
  }

  private getPriceErrorMessage(errors: ValidationErrors) {
    if (errors.required) {
      return 'Field should not be empty';
    }
    if (errors.min) {
      return `Price cannot be lower than ${errors?.min?.min}`
    }
    return null;
  }
}
