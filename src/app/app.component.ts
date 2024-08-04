import {Component, OnInit, Signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignalRService } from './services/signalr.service';
import { FormsModule } from '@angular/forms';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgForOf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  user: string = '';
  message: string = '';
  messages!: Signal<string[]>; // Signal to store messages

  constructor(private signalRService: SignalRService) {}
  ngOnInit() {
      this.signalRService.startConnection();
      this.signalRService.addDataListener();

      this.messages = this.signalRService.getMessages(); // Use the signal from the service
  }
  sendMessage() {
      this.signalRService.sendMessage(this.user, this.message);
      this.message = '';
  }
}
