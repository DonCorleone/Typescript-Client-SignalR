// src/app/services/signalr.service.ts
import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ReservationEntry } from '../models/reservation-entry';
@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  private reservationEntries = signal<ReservationEntry[]>([]); // Signal to store messages

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5263/hub', {
        withCredentials: true,
      })
      .build();
  }
  startConnection(): void {
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err));
  }
  public addDataListener() {
    this.hubConnection.on(
      'messageReceived',
      (reservationEntry: ReservationEntry) => {
        console.log(
          `User: ${reservationEntry.name}, Time: ${reservationEntry.timestamp}`
        );
        this.reservationEntries.update((reservationEntries) => [
          ...reservationEntries,
          reservationEntry,
        ]);
        // expose the message to the UI
      }
    );
  }
  getMessages() {
    return this.reservationEntries.asReadonly(); // Expose messages as a readonly signal
  }
  public sendMessage(reservationEntry: ReservationEntry) {
    this.hubConnection
      .invoke('newMessage', reservationEntry)
      .catch((err) => console.error(err));
  }
}
