import { Component, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import axios from 'axios';

@Component({
  standalone: true,
  selector: 'app-chat',
  imports: [
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  newMessage: string = '';
  messageHistory: { content: string, sent: boolean }[] = [];
  loading: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messageHistory.push({ content: this.newMessage, sent: true });
      this.loading = true;

      const messageObject = { message: this.newMessage };
      this.newMessage = '';
      axios.post('https://backend-5ac1.onrender.com/sendMessage', messageObject)
        .then((response: any) => {
          if (response.data && response.data[0] && response.data[0].response) {
            const receivedMessage = response.data[0].response.response;
            this.messageHistory.push({ content: receivedMessage, sent: false });
            this.cdr.detectChanges();
          } else {
            console.error('Invalid response format:', response.data);
          }
        })
        .catch((error: any) => {
          console.error('Error sending message:', error);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

copyToClipboard(text: string) {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}