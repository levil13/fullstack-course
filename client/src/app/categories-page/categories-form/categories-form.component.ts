import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AbstractComponent} from "../../abstract.component";
import {switchMap, takeUntil} from "rxjs/operators";
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {FormUtils} from "../../utils/FormUtils";
import {CategoriesService} from "../../shared/services/categories.service";
import {of} from "rxjs";
import {MaterialService} from "../../shared/services/material.service";
import {Category} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent extends AbstractComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput')
  public inputRef: ElementRef;

  public isNew: boolean = true;

  public form: FormGroup;
  public FormUtils = FormUtils;
  public image: File;
  public imagePreview: string;
  public category: Category;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private categoriesService: CategoriesService) {
    super();
  }

  public ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });

    this.form.disable();

    this.route.params
      .pipe(switchMap(
        (params: Params) => {
          if (params.id) {
            this.isNew = false;
            return this.categoriesService.getById(params.id);
          }
          return of(null);
        }),
        takeUntil(this.unsubscribe$))
      .subscribe(
        category => {
          if (category) {
            this.category = category;
            this.form.patchValue({name: category.name});
            if (category.imageSrc) {
              this.imagePreview = category.imageSrc;
            }
            MaterialService.updateTextFields();
          }
          this.form.enable();
        },
        error => {
          MaterialService.toast(error?.error?.message)
          this.form.enable();
        })
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
  }

  public onSubmit() {
    this.form.disable();
    let obs$;
    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image);
    } else {
      obs$ = this.categoriesService.update(this.category._id as string, this.form.value.name, this.image);
    }

    obs$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (category) => {
          this.category = category;
          MaterialService.toast('Changes saved');
          this.form.enable();
        },
        error => {
          MaterialService.toast(error?.error?.message);
          this.form.enable();
        })
  }

  public onUploadImageClick() {
    this.inputRef.nativeElement.click();
  }

  public onFileUpload(event: Event) {
    // @ts-ignore
    const file = event?.target?.files[0];
    this.image = file;

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = (reader.result as string);
    reader.readAsDataURL(file);
  }

  public onDeleteCategoryClick() {
    const decision = window.confirm(`Are you sure you want to delete category ${this.category.name}?`);
    if (decision) {
      this.deleteCategory();
    }
  }

  private deleteCategory() {
    this.categoriesService.delete(this.category._id as string)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        response => MaterialService.toast(response.message),
        error => MaterialService.toast(error?.error?.message),
        () => this.router.navigate(['/categories'])
      );
  }

  public getErrorMessage(formControlName: string): string | null {
    const formControl = this.form.get(formControlName);
    if (!formControl) return null;
    const errors = formControl.errors;
    if (!errors) return null;

    switch (formControlName) {
      case 'name':
        return this.getNameErrorMessage(errors);
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
}
