import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  title = 'Botty-client';

  constructor(private socket: SocketService) {}

  ngOnInit() {
    this.socket.onMessage('start-call', (data: any) => {
      console.log('Call started', data);
    });
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }
}
