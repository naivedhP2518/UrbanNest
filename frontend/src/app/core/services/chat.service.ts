import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Message {
  _id?: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  receiver: string;
  property: string;
  content: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private backendUrl = 'http://localhost:5000';
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.socket = io(this.backendUrl);

    this.socket.on('message', (message: Message) => {
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, message]);
    });
  }

  joinRoom(userId: string, propertyId: string) {
    this.socket.emit('join', { userId, propertyId });
    this.getChatHistory(propertyId, userId).subscribe(res => {
      if (res.success) {
        this.messagesSubject.next(res.data);
      }
    });
  }

  getChatHistory(propertyId: string, userId: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/messages/${propertyId}/${userId}`);
  }

  sendMessage(messageData: any) {
    this.socket.emit('sendMessage', messageData);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
