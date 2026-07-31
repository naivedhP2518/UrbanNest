import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, Message } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() propertyId!: string;
  @Input() agentId!: string;
  @Input() agentName!: string;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  messages: Message[] = [];
  newMessage = '';
  currentUser: any;
  conversationId: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private chatService: ChatService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUser();
    if (this.currentUser && this.propertyId && this.agentId) {
      const token = this.authService.getToken();
      if (token) {
        this.chatService.connect(token);
      }

      // Create or get existing conversation
      this.chatService
        .createConversation(this.agentId, this.propertyId)
        .subscribe((res: any) => {
          if (res.success) {
            this.conversationId = res.data._id;
            this.chatService.joinConversation(this.conversationId!);
            this.chatService.loadMessages(this.conversationId!);
          }
        });

      this.subscription.add(
        this.chatService.messages$.subscribe((msgs) => {
          this.messages = msgs;
          this.scrollToBottom();
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.conversationId) {
      this.chatService.leaveConversation(this.conversationId);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.newMessage.trim() && this.conversationId && this.currentUser) {
      this.chatService.sendMessage(this.conversationId, this.currentUser.id, this.newMessage);
      this.newMessage = '';
    }
  }

  getAvatarUrl(): string {
    return this.authService.getAvatarUrl();
  }

  closeChat() {
    this.isOpen = false;
    this.close.emit();
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
