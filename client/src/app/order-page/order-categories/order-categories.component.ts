import {Component, OnInit} from '@angular/core';
import {CategoriesService} from "../../shared/services/categories.service";
import {Category} from "../../shared/interfaces";
import {Observable} from "rxjs";

@Component({
  selector: 'app-order-categories',
  templateUrl: './order-categories.component.html',
  styleUrls: ['./order-categories.component.css']
})
export class OrderCategoriesComponent implements OnInit {

  public categories$: Observable<Category[]>;

  constructor(private categoriesService: CategoriesService) {
  }

  public ngOnInit(): void {
    this.categories$ = this.categoriesService.fetch();
  }

}
