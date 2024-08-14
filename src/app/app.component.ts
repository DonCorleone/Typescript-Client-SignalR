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
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
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
    this.signalRService.addReservation({
      id: this.reservationEntries.length + 1,
      name: this.user,
      timestamp: new Date(),
      tags: [],
    });
    this.user = '';
  }
  deleteReservation(reservation: ReservationEntry) {
    this.signalRService.deleteReservation(reservation);
  }
}
