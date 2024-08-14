// src/app/services/signalr.service.ts
import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ReservationEntry } from '../models/reservation-entry';
import { HttpClient, HttpRequest } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  private reservationEntries = signal<ReservationEntry[]>([]); // Signal to store messages

  constructor(private httpClient: HttpClient) {
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
      'ReservationAdded',
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
    this.hubConnection.on(
      'ReservationDeleted',
      (reservationId: number) => {
        console.log(`Reservation with id: ${reservationId} has been deleted`);
        this.reservationEntries.update((reservationEntries) =>
          reservationEntries.filter((entry) => entry.id !== reservationId)
        );
      }
    );
  }

  getMessages() {
    return this.reservationEntries.asReadonly(); // Expose messages as a readonly signal
  }
  public addReservation(reservationEntry: ReservationEntry) {

    this.httpClient.post<ReservationEntry>('http://localhost:5263/api/ReservationEntries', reservationEntry).subscribe(reservation => {
      console.log('Updated reservation:', reservation);
    });

    // this.hubConnection
    //   .invoke('newMessage', reservationEntry)
    //   .catch((err) => console.error(err));
  }

  public deleteReservation(reservationEntry: ReservationEntry) {
    this.httpClient.delete('http://localhost:5263/api/ReservationEntries?reservationId=' + reservationEntry.id).subscribe(reservationId => {
      console.log('Deleted reservation:', reservationId);
    });
  }
}
