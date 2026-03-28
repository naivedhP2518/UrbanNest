import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

export interface Message {
  _id?: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  conversation: string;
  content: string;
  createdAt?: string;
}

export interface Conversation {
  _id: string;
  participants: {
    _id: string;
    name: string;
    avatar?: string;
    email?: string;
    role?: string;
  }[];
  property: {
    _id: string;
    title: string;
    images?: string[];
  };
  lastMessage: string;
  lastMessageAt: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket | null = null;
  private backendUrl = 'http://localhost:5000';
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  private typingSubject = new Subject<{ userId: string; conversationId: string }>();

  public messages$ = this.messagesSubject.asObservable();
  public conversations$ = this.conversationsSubject.asObservable();
  public typing$ = this.typingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Initialize socket connection with JWT
  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(this.backendUrl, {
      auth: { token },
    });

    this.socket.on('newMessage', ({ conversationId, message }: any) => {
      const currentMessages = this.messagesSubject.value;
      // Only add message if we're viewing that conversation
      if (message.conversation === conversationId) {
        this.messagesSubject.next([...currentMessages, message]);
      }
    });

    this.socket.on('conversationUpdated', (conversation: Conversation) => {
      const currentConversations = this.conversationsSubject.value;
      const idx = currentConversations.findIndex((c) => c._id === conversation._id);
      if (idx >= 0) {
        currentConversations[idx] = conversation;
        this.conversationsSubject.next([...currentConversations]);
      } else {
        this.conversationsSubject.next([conversation, ...currentConversations]);
      }
    });

    this.socket.on('userTyping', (data: any) => {
      this.typingSubject.next(data);
    });

    this.socket.on('userStopTyping', (data: any) => {
      this.typingSubject.next({ ...data, userId: '' });
    });
  }

  // HTTP methods
  getConversations(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.backendUrl}/api/messages/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getMessages(conversationId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.backendUrl}/api/messages/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  createConversation(participantId: string, propertyId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(
      `${this.backendUrl}/api/messages/conversations`,
      { participantId, propertyId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  // Socket methods
  joinConversation(conversationId: string) {
    this.socket?.emit('joinConversation', conversationId);
  }

  leaveConversation(conversationId: string) {
    this.socket?.emit('leaveConversation', conversationId);
  }

  sendMessage(conversationId: string, content: string) {
    this.socket?.emit('sendMessage', { conversationId, content });
  }

  emitTyping(conversationId: string) {
    this.socket?.emit('typing', { conversationId });
  }

  emitStopTyping(conversationId: string) {
    this.socket?.emit('stopTyping', { conversationId });
  }

  loadConversations() {
    this.getConversations().subscribe((res: any) => {
      if (res.success) {
        this.conversationsSubject.next(res.data);
      }
    });
  }

  loadMessages(conversationId: string) {
    this.getMessages(conversationId).subscribe((res: any) => {
      if (res.success) {
        this.messagesSubject.next(res.data);
      }
    });
  }

  clearMessages() {
    this.messagesSubject.next([]);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
