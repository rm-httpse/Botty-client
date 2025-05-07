import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private serverUrl: string = environment.apiUrl

  constructor() {
    this.socket = io(this.serverUrl);
  }

  sendMessage(event: string, data: any) {
    this.socket.emit(event, data);
  }

  onMessage(event: string, cb: any) {
    this.socket.on(event, cb);
  }

  disconnect() {
    this.socket.disconnect();
  }
}
