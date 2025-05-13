import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLDivElement>;
  title = 'Botty-client';
  screenBase64: string | null = null;
  task: any = null;
  status: string = 'esperando...';
  messages: { from: 'Bot' | 'User'; text: string }[] = [];
  userInput: string = '';
  botIdle: any = {
    from: 'Bot',
    text: 'Bot is procrastinating'
  }

  constructor(private socket: SocketService) {}

  ngOnInit() {
    this.socket.onMessage('start-call', (data: any) => {
      console.log('Call started', data);
    });
    this.socket.onMessage('hold-call', (data: any) => {
      console.log('Call on hold', data);
    });
    this.socket.onMessage('bot-data', (data: any) => {
      this.screenBase64 = data.screen;
      this.status = data.status;
      // this.messages.push(data.task ? data.task : this.botIdle)
      this.messages.push(this.botIdle)
    });
  }

  ngAfterViewChecked() {
    if (this.isUserAtBottom()) {
      this.scrollChat();
    }
  }

  isUserAtBottom(): boolean {
    const container = this.messagesContainer?.nativeElement;
    if (container) {
      const threshold = 100;
      const position = container.scrollTop + container.clientHeight;
      const height = container.scrollHeight;
      return height - position <= threshold;
    }

    return true;
  }

  scrollChat() {
    const el = this.messagesContainer?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight + 50000;
  }

  sendMessage() {
    if (!this.userInput.trim()) return;
    this.socket.sendMessage('user-order', {
      text: this.userInput
    })

    this.messages.push({ from: 'User', text: this.userInput.trim() });
    this.userInput = '';
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }
}
