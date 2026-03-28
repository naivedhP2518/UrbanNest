import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChatService, Conversation, Message } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class ChatPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  conversations: Conversation[] = [];
  activeConversation: Conversation | null = null;
  messages: Message[] = [];
  newMessage = '';
  currentUser: any;
  searchQuery = '';
  isTyping = false;
  typingUser = '';
  private subscriptions = new Subscription();

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUser();
    if (!this.currentUser) return;

    const token = this.authService.getToken();
    if (token) {
      this.chatService.connect(token);
      this.chatService.loadConversations();
    }

    this.subscriptions.add(
      this.chatService.conversations$.subscribe((conversations) => {
        this.conversations = conversations;
      })
    );

    this.subscriptions.add(
      this.chatService.messages$.subscribe((messages) => {
        this.messages = messages;
      })
    );

    this.subscriptions.add(
      this.chatService.typing$.subscribe(({ userId, conversationId }) => {
        if (
          this.activeConversation?._id === conversationId &&
          userId !== this.currentUser.id &&
          userId !== ''
        ) {
          this.isTyping = true;
          const participant = this.activeConversation?.participants.find(
            (p) => p._id === userId
          );
          this.typingUser = participant?.name || 'Someone';
          setTimeout(() => (this.isTyping = false), 3000);
        } else {
          this.isTyping = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.chatService.disconnect();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  selectConversation(conversation: Conversation) {
    if (this.activeConversation) {
      this.chatService.leaveConversation(this.activeConversation._id);
    }

    this.activeConversation = conversation;
    this.chatService.clearMessages();
    this.chatService.joinConversation(conversation._id);
    this.chatService.loadMessages(conversation._id);
  }

  sendMessage() {
    if (this.newMessage.trim() && this.activeConversation) {
      this.chatService.sendMessage(
        this.activeConversation._id,
        this.newMessage
      );
      this.newMessage = '';
      this.chatService.emitStopTyping(this.activeConversation._id);
    }
  }

  onTyping() {
    if (this.activeConversation) {
      this.chatService.emitTyping(this.activeConversation._id);
    }
  }

  getOtherParticipant(conversation: Conversation) {
    return conversation.participants.find(
      (p) => p._id !== this.currentUser?.id
    );
  }

  getFilteredConversations(): Conversation[] {
    if (!this.searchQuery.trim()) return this.conversations;
    const query = this.searchQuery.toLowerCase();
    return this.conversations.filter((c) => {
      const other = this.getOtherParticipant(c);
      return (
        other?.name.toLowerCase().includes(query) ||
        c.property?.title?.toLowerCase().includes(query)
      );
    });
  }

  formatTime(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }
}
