import { Component } from '@angular/core';

@Component({
  selector: 'kos-seat',
  templateUrl: './seat.component.html',
})
export class SeatComponent {
  seatCode: string = null;
  checking: boolean = false;

  checkSeat() {
    this.checking = true;
  }
}
