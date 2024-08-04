// src/app/services/signalr.service.ts
import {Injectable, signal} from '@angular/core';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  private messages = signal<string[]>([]); // Signal to store messages

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://laundrysignalr-init.onrender.com/hub', {
        withCredentials: true
      })
      .build();
  }
  startConnection(): void {
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }
  public addDataListener() {
    this.hubConnection.on('messageReceived', (user, message) => {
      console.log(`User: ${user}, Message: ${message}`);
      this.messages.update(messages => [...messages, message]);
      // expose the message to the UI

    });
  }
  getMessages() {
    return this.messages.asReadonly(); // Expose messages as a readonly signal
  }
  public sendMessage(user: string, message: string) {
    this.hubConnection.invoke('newMessage', user, message)
      .catch(err => console.error(err));
  }
}
