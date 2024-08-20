import { Component, OnInit, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignalRService } from './services/signalr.service';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { ReservationEntry } from './models/reservation-entry';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgForOf],
  template: `
    <div>
      <input [(ngModel)]="user" placeholder="User" />
      <button (click)="addReservation()">Send</button>
    </div>
    <div>
      <h2>Reservations</h2>
      <ul>
        @for(reservation of reservationEntries(); track reservation.timestamp) {
        <li>
          {{ reservation.name }} : {{ reservation.id }}
          <button (click)="deleteReservation(reservation)">Delete</button>
        </li>
        }
      </ul>
    </div>
  `,
})
export class AppComponent implements OnInit {
  user: string = '';
  reservationEntries!: Signal<ReservationEntry[]>; // Signal to store messages

  constructor(private signalRService: SignalRService) {}
  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addDataListener();

    this.reservationEntries = this.signalRService.getMessages(); // Use the signal from the service
  }
  addReservation() {
    const timestamp = new Date();
    this.signalRService.addReservation({
      id: this.calculateNumberFromDate(timestamp),
      name: this.user,
      timestamp: timestamp,
      tags: ['Machine 1'],
    });
    this.user = '';
  }
  deleteReservation(reservation: ReservationEntry) {
    this.signalRService.deleteReservation(reservation);
  }
  // New function to calculate a number based on date and time
  public calculateNumberFromDate(date: Date): number {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based in JavaScript
    const day = date.getDate();
    let hour = date.getHours();
    // for test cases, generate a random number between 0 and 24
    hour = Math.floor(Math.random() * 24);

    let minute = date.getMinutes();
    // for test cases, generate a random number between 0 and 59
    minute = Math.floor(Math.random() * 59);

    // Example formula: weighted sum of components
    const calculatedNumber =
      year * 100000000 + month * 1000000 + day * 10000 + hour * 100 + minute;

    return calculatedNumber;
  }
}
