import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Order} from "../interfaces";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class OrdersService {
  constructor(private http: HttpClient) {
  }

  public fetch(params: any = {}): Observable<Order[]> {
    return this.http.get<Order[]>('/api/order', {
      params: new HttpParams({fromObject: params})
    });
  }

  public create(order: Order): Observable<Order> {
    return this.http.post<Order>('/api/order', order);
  }
}
