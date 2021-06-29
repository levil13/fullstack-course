import {Injectable} from "@angular/core";
import {OrderPosition, Position} from "../shared/interfaces";

@Injectable()
export class OrderService {

  public list: OrderPosition[] = [];
  public price: number = 0;

  public add(position: Position) {
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name!,
      price: position.price!,
      quantity: position.quantity!,
      _id: position._id
    });

    const existingPosition = this.list.find(p => p._id === position._id);

    if (existingPosition) {
      existingPosition.quantity += orderPosition.quantity;
    } else {
      this.list.push(orderPosition);
    }

    this.calculatePrice();
  }

  public remove(item: OrderPosition) {
    const idx = this.list.findIndex(position => position._id === item._id);
    this.list.splice(idx, 1);

    this.calculatePrice();
  }

  public clear() {
    this.list = [];
    this.price = 0;
  }

  private calculatePrice() {
    this.price = this.list.reduce((total, item) => total += item.quantity * item.price, 0);
  }
}
